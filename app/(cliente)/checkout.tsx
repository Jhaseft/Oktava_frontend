import { useEffect, useState, useCallback, useMemo } from 'react';
import { View, Text, ScrollView, TouchableOpacity, TextInput, Alert } from 'react-native';
import { router, useFocusEffect } from 'expo-router';
import { useAuth } from '@/src/context/AuthContext';
import { Ionicons } from '@expo/vector-icons';
import { consumePendingAddressSelect } from '@/src/lib/pendingAddressSelect';
import { haversineKm, calcDeliveryFee, STORE_LAT, STORE_LNG, MAX_DELIVERY_KM } from '@/src/lib/maps';
import { useCart } from '@/src/context/CartContext';
import { orderService } from '@/src/services/order.service';
import { addressService } from '@/src/services/address.service';
import { AddressCard } from '@/src/components/address/AddressCard';
import { Button } from '@/src/components/ui/Button';
import { PhoneVerificationModal } from '@/src/components/phone/PhoneVerificationModal';
import type { OrderType } from '@/src/types/order.types';
import type { Address } from '@/src/types/address.types';

type PaymentMethod = 'CASH' | 'QR';

const PAYMENT_OPTIONS: { method: PaymentMethod; label: string; icon: string }[] = [
  { method: 'CASH', label: 'Al recoger', icon: 'cash-outline' },
  { method: 'QR',   label: 'Por QR',     icon: 'qr-code-outline' },
];

export default function CheckoutScreen() {
  const { token } = useAuth();
  const { items, totalAmount, clearCart } = useCart();

  useEffect(() => {
    if (!token) router.replace('/login');
  }, [token]);

  const [orderType, setOrderType] = useState<OrderType>('PICKUP');
  const [paymentMethod, setPaymentMethod] = useState<PaymentMethod>('CASH');
  const [addresses, setAddresses] = useState<Address[]>([]);
  const [selectedAddressId, setSelectedAddressId] = useState<string | null>(null);
  const [notes, setNotes] = useState('');
  const [loadingAddresses, setLoadingAddresses] = useState(false);
  const [placing, setPlacing] = useState(false);
  const [showOtpModal, setShowOtpModal] = useState(false);
  const [phoneJustVerified, setPhoneJustVerified] = useState(false);

  const loadAddresses = useCallback(async () => {
    setLoadingAddresses(true);
    try {
      const data = await addressService.getAddresses();
      setAddresses(data);
    } catch {}
    finally { setLoadingAddresses(false); }
  }, []);

  useEffect(() => {
    if (orderType === 'DELIVERY') loadAddresses();
  }, [orderType, loadAddresses]);

  useFocusEffect(
    useCallback(() => {
      const pendingId = consumePendingAddressSelect();
      if (!pendingId) return;
      addressService.getAddresses()
        .then((data) => {
          setAddresses(data);
          setSelectedAddressId(pendingId);
        })
        .catch(() => {});
    }, []),
  );

  const selectedAddress = useMemo(
    () => addresses.find((a) => a.id === selectedAddressId) ?? null,
    [addresses, selectedAddressId],
  );

  const deliveryKm = useMemo(() => {
    if (orderType !== 'DELIVERY' || !selectedAddress) return 0;
    return haversineKm(STORE_LAT, STORE_LNG, selectedAddress.latitude, selectedAddress.longitude);
  }, [orderType, selectedAddress]);

  const outOfRange = orderType === 'DELIVERY' && !!selectedAddress && deliveryKm > MAX_DELIVERY_KM;
  const deliveryFee = orderType === 'DELIVERY' && selectedAddress && !outOfRange
    ? calcDeliveryFee(deliveryKm)
    : 0;
  const grandTotal = totalAmount + deliveryFee;

  const canPlace =
    items.length > 0 &&
    !outOfRange &&
    (orderType === 'PICKUP' || (orderType === 'DELIVERY' && !!selectedAddressId));

  const handlePlace = async () => {
    if (!canPlace) return;

    setPlacing(true);
    try {
      const order = await orderService.createOrder({
        orderType: orderType,
        items: items.map((i) => ({ productId: i.productId, quantity: i.quantity })),
        ...(orderType === 'DELIVERY' && selectedAddressId ? { addressId: selectedAddressId } : {}),
        ...(notes.trim() ? { notes: notes.trim() } : {}),
      });
      clearCart();

      if (paymentMethod === 'QR') {
        router.replace({
          pathname: '/(cliente)/qr-payment',
          params: { orderId: order.id, total: grandTotal.toFixed(2) },
        });
      } else {
        router.replace('/(cliente)/orders');
      }
    } catch (e: any) {
      if (e?.response?.data?.code === 'PHONE_NOT_VERIFIED') {
        setShowOtpModal(true);
        return;
      }
      Alert.alert('Error', e?.response?.data?.message ?? 'No se pudo crear el pedido.');
    } finally {
      setPlacing(false);
    }
  };

  const handlePhoneVerified = () => {
    setShowOtpModal(false);
    setPhoneJustVerified(true);
    setTimeout(() => setPhoneJustVerified(false), 5000);
  };

  return (
    <>
      <PhoneVerificationModal
        visible={showOtpModal}
        onVerified={handlePhoneVerified}
        onClose={() => setShowOtpModal(false)}
      />
      <ScrollView className="flex-1 bg-black" keyboardShouldPersistTaps="handled">
        <View className="px-5 pt-14 pb-8 gap-6">
          <Text className="text-white text-2xl font-bold">Checkout</Text>

          {phoneJustVerified && (
            <View className="bg-green-500/10 border border-green-500/30 rounded-xl px-4 py-3">
              <Text className="text-green-400 text-sm font-medium">
                ✓ Número verificado. Ya puedes confirmar tu pedido.
              </Text>
            </View>
          )}

          {/* Tipo de pedido */}
          <View className="gap-2">
            <Text className="text-zinc-400 text-xs font-medium uppercase tracking-wider">Tipo de pedido</Text>
            <View className="flex-row gap-3">
              {(['PICKUP', 'DELIVERY'] as OrderType[]).map((type) => (
                <TouchableOpacity
                  key={type}
                  onPress={() => setOrderType(type)}
                  activeOpacity={0.7}
                  className={`flex-1 rounded-xl border py-3 items-center ${
                    orderType === type ? 'border-red-500 bg-red-500/20' : 'border-white/10 bg-white/5'
                  }`}
                >
                  <Text className={`font-semibold text-sm ${orderType === type ? 'text-white' : 'text-zinc-400'}`}>
                    {type === 'PICKUP' ? 'Recojo en tienda' : 'Delivery'}
                  </Text>
                </TouchableOpacity>
              ))}
            </View>
          </View>

          {/* Dirección */}
          {orderType === 'DELIVERY' && (
            <View className="gap-2">
              <View className="flex-row items-center justify-between">
                <Text className="text-zinc-400 text-xs font-medium uppercase tracking-wider">Dirección</Text>
                <TouchableOpacity onPress={() => router.push({ pathname: '/(cliente)/addresses', params: { from: 'checkout' } })} activeOpacity={0.7}>
                  <Text className="text-red-400 text-sm">Gestionar</Text>
                </TouchableOpacity>
              </View>
              {loadingAddresses && (
                <Text className="text-zinc-500 text-sm">Cargando direcciones...</Text>
              )}
              {!loadingAddresses && addresses.length === 0 && (
                <View className="gap-2">
                  <Text className="text-zinc-500 text-sm">No tienes direcciones guardadas.</Text>
                  <Button label="Agregar dirección" variant="secondary" onPress={() => router.push({ pathname: '/(cliente)/addresses', params: { from: 'checkout' } })} />
                </View>
              )}
              {!loadingAddresses && addresses.length > 0 && (
                <View className="gap-2">
                  {addresses.map((addr) => (
                    <AddressCard
                      key={addr.id}
                      address={addr}
                      selected={selectedAddressId === addr.id}
                      onSelect={() => setSelectedAddressId(addr.id)}
                    />
                  ))}
                </View>
              )}
            </View>
          )}

          {/* Método de pago */}
          <View className="gap-2">
            <Text className="text-zinc-400 text-xs font-medium uppercase tracking-wider">Método de pago</Text>
            <View className="flex-row gap-3">
              {PAYMENT_OPTIONS.map(({ method, label, icon }) => (
                <TouchableOpacity
                  key={method}
                  onPress={() => setPaymentMethod(method)}
                  activeOpacity={0.7}
                  className={`flex-1 rounded-xl border py-3 items-center gap-1 ${
                    paymentMethod === method ? 'border-red-500 bg-red-500/20' : 'border-white/10 bg-white/5'
                  }`}
                >
                  <Ionicons
                    name={icon as any}
                    size={20}
                    color={paymentMethod === method ? '#ffffff' : '#71717a'}
                  />
                  <Text className={`font-semibold text-sm ${paymentMethod === method ? 'text-white' : 'text-zinc-400'}`}>
                    {label}
                  </Text>
                </TouchableOpacity>
              ))}
            </View>
          </View>

          {/* Notas */}
          <View className="gap-2">
            <Text className="text-zinc-400 text-xs font-medium uppercase tracking-wider">Notas (opcional)</Text>
            <TextInput
              value={notes}
              onChangeText={setNotes}
              placeholder="Ej: Sin cebolla, extra salsa..."
              placeholderTextColor="#52525b"
              multiline
              numberOfLines={3}
              className="bg-zinc-900 text-white rounded-xl px-4 py-3 border border-white/10 text-sm"
              style={{ textAlignVertical: 'top', minHeight: 80 }}
            />
          </View>

          {/* Fuera de cobertura */}
          {outOfRange && (
            <View className="bg-red-500/10 border border-red-500/30 rounded-xl px-4 py-3">
              <Text className="text-red-400 text-sm font-medium">
                La dirección está fuera del área de cobertura ({deliveryKm.toFixed(1)} km). Máximo {MAX_DELIVERY_KM} km.
              </Text>
            </View>
          )}

          {/* Resumen */}
          <View className="bg-zinc-900 rounded-2xl p-4 gap-2 border border-white/5">
            <Text className="text-white font-semibold mb-1">Resumen</Text>
            {items.map((item) => (
              <View key={item.productId} className="flex-row justify-between">
                <Text className="text-zinc-300 text-sm">{item.quantity}× {item.name}</Text>
                <Text className="text-zinc-400 text-sm">Bs. {(item.price * item.quantity).toFixed(2)}</Text>
              </View>
            ))}
            <View className="h-px bg-white/10 my-1" />
            <View className="flex-row justify-between">
              <Text className="text-zinc-400 text-sm">Subtotal</Text>
              <Text className="text-zinc-300 text-sm">Bs. {totalAmount.toFixed(2)}</Text>
            </View>
            {orderType === 'DELIVERY' && (
              <View className="flex-row justify-between">
                <Text className="text-zinc-400 text-sm">Delivery</Text>
                {outOfRange && <Text className="text-red-400 text-sm">Fuera de cobertura</Text>}
                {!outOfRange && selectedAddress && <Text className="text-zinc-300 text-sm">Bs. {deliveryFee.toFixed(2)}</Text>}
                {!outOfRange && !selectedAddress && <Text className="text-zinc-500 text-sm">— selecciona dirección</Text>}
              </View>
            )}
            <View className="flex-row justify-between">
              <Text className="text-zinc-400 text-sm">Método de pago</Text>
              <Text className="text-zinc-300 text-sm">{paymentMethod === 'CASH' ? 'Al recoger' : 'Por QR'}</Text>
            </View>
            <View className="h-px bg-white/10 my-1" />
            <View className="flex-row justify-between">
              <Text className="text-white font-bold">Total</Text>
              <Text className="text-red-400 font-bold">Bs. {grandTotal.toFixed(2)}</Text>
            </View>
          </View>

          <Button label="Confirmar pedido" onPress={handlePlace} loading={placing} disabled={!canPlace} />
        </View>
      </ScrollView>
    </>
  );
}
