import { useEffect, useState, useCallback } from 'react';
import { View, Text, ScrollView, TouchableOpacity, TextInput, Alert } from 'react-native';
import { router } from 'expo-router';
import { useCart } from '@/src/context/CartContext';
import { orderService } from '@/src/services/order.service';
import { addressService } from '@/src/services/address.service';
import { AddressCard } from '@/src/components/address/AddressCard';
import { Button } from '@/src/components/ui/Button';
import { LoadingState } from '@/src/components/ui/LoadingState';
import type { OrderType } from '@/src/types/order.types';
import type { Address } from '@/src/types/address.types';

export default function CheckoutScreen() {
  const { items, totalAmount, clearCart } = useCart();
  const [orderType, setOrderType] = useState<OrderType>('PICKUP');
  const [addresses, setAddresses] = useState<Address[]>([]);
  const [selectedAddressId, setSelectedAddressId] = useState<string | null>(null);
  const [notes, setNotes] = useState('');
  const [loadingAddresses, setLoadingAddresses] = useState(false);
  const [placing, setPlacing] = useState(false);

  const loadAddresses = useCallback(async () => {
    setLoadingAddresses(true);
    try {
      const data = await addressService.getAddresses();
      setAddresses(data);
      const def = data.find((a) => a.isDefault);
      if (def) setSelectedAddressId(def.id);
    } catch {}
    finally { setLoadingAddresses(false); }
  }, []);

  useEffect(() => {
    if (orderType === 'DELIVERY') loadAddresses();
  }, [orderType, loadAddresses]);

  const canPlace =
    items.length > 0 &&
    (orderType === 'PICKUP' || (orderType === 'DELIVERY' && !!selectedAddressId));

  const handlePlace = async () => {
    if (!canPlace) return;
    setPlacing(true);
    try {
      await orderService.createOrder({
        type: orderType,
        items: items.map((i) => ({ productId: i.productId, quantity: i.quantity })),
        ...(orderType === 'DELIVERY' && selectedAddressId ? { addressId: selectedAddressId } : {}),
        ...(notes.trim() ? { notes: notes.trim() } : {}),
      });
      clearCart();
      router.replace('/(cliente)/orders');
    } catch (e: any) {
      Alert.alert('Error', e?.response?.data?.message ?? 'No se pudo crear el pedido.');
    } finally {
      setPlacing(false);
    }
  };

  return (
    <ScrollView className="flex-1 bg-black" keyboardShouldPersistTaps="handled">
      <View className="px-5 pt-14 pb-8 gap-6">
        <Text className="text-white text-2xl font-bold">Checkout</Text>

        {/* Order type */}
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

        {/* Address picker for delivery */}
        {orderType === 'DELIVERY' && (
          <View className="gap-2">
            <View className="flex-row items-center justify-between">
              <Text className="text-zinc-400 text-xs font-medium uppercase tracking-wider">Dirección</Text>
              <TouchableOpacity onPress={() => router.push('/(cliente)/addresses')} activeOpacity={0.7}>
                <Text className="text-red-400 text-sm">Gestionar</Text>
              </TouchableOpacity>
            </View>
            {loadingAddresses ? (
              <Text className="text-zinc-500 text-sm">Cargando direcciones...</Text>
            ) : addresses.length === 0 ? (
              <View className="gap-2">
                <Text className="text-zinc-500 text-sm">No tienes direcciones guardadas.</Text>
                <Button label="Agregar dirección" variant="secondary" onPress={() => router.push('/(cliente)/addresses')} />
              </View>
            ) : (
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

        {/* Notes */}
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

        {/* Summary */}
        <View className="bg-zinc-900 rounded-2xl p-4 gap-2 border border-white/5">
          <Text className="text-white font-semibold mb-1">Resumen</Text>
          {items.map((item) => (
            <View key={item.productId} className="flex-row justify-between">
              <Text className="text-zinc-300 text-sm">{item.quantity}× {item.name}</Text>
              <Text className="text-zinc-400 text-sm">S/ {(item.price * item.quantity).toFixed(2)}</Text>
            </View>
          ))}
          <View className="h-px bg-white/10 my-1" />
          <View className="flex-row justify-between">
            <Text className="text-white font-bold">Total</Text>
            <Text className="text-red-400 font-bold">S/ {totalAmount.toFixed(2)}</Text>
          </View>
        </View>

        <Button label="Confirmar pedido" onPress={handlePlace} loading={placing} disabled={!canPlace} />
      </View>
    </ScrollView>
  );
}
