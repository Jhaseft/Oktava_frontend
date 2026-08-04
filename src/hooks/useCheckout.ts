import { useEffect, useState, useCallback, useMemo } from 'react';
import { Alert } from 'react-native';
import { router, useFocusEffect } from 'expo-router';
import { useAuth } from '@/src/context/AuthContext';
import { useCart } from '@/src/context/CartContext';
import { useStoreStatus } from '@/src/context/StoreStatusContext';
import { consumePendingAddressSelect } from '@/src/lib/pendingAddressSelect';
import { haversineKm, calcDeliveryFee, STORE_LAT, STORE_LNG, MAX_DELIVERY_KM } from '@/src/lib/maps';
import { orderService } from '@/src/services/order.service';
import { addressService } from '@/src/services/address.service';
import type { OrderType, CreateOrderItemOption } from '@/src/types/order.types';
import type { CartItem } from '@/src/types/cart.types';
import type { Address } from '@/src/types/address.types';
import type { PaymentMethod } from '@/src/types/checkout.types';

function cartItemToOrderItem(i: CartItem): { productId: string; quantity: number; selectedOptions: CreateOrderItemOption[] } {
  return {
    productId: i.productId,
    quantity: i.quantity,
    selectedOptions: i.selectedOptions.flatMap((group) =>
      group.items.map((opt) => ({
        optionId: opt.optionId,
        optionName: opt.name,
        extraPrice: opt.extraPrice,
      })),
    ),
  };
}

export function useCheckout() {
  const { token } = useAuth();
  const { items, totalAmount, clearCart } = useCart();
  const { isOpen: storeOpen, message: storeMessage, refresh: refreshStore } = useStoreStatus();

  const [orderType, setOrderType] = useState<OrderType>('PICKUP');
  const [paymentMethod, setPaymentMethod] = useState<PaymentMethod>('CASH');
  const [addresses, setAddresses] = useState<Address[]>([]);
  const [selectedAddressId, setSelectedAddressId] = useState<string | null>(null);
  const [notes, setNotes] = useState('');
  const [loadingAddresses, setLoadingAddresses] = useState(false);
  const [placing, setPlacing] = useState(false);

  useEffect(() => {
    if (!token) router.replace('/login');
  }, [token]);

  const loadAddresses = useCallback(async () => {
    setLoadingAddresses(true);
    try {
      setAddresses(await addressService.getAddresses());
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
  const deliveryFee = orderType === 'DELIVERY' && selectedAddress && !outOfRange ? calcDeliveryFee(deliveryKm) : 0;
  const grandTotal = totalAmount + deliveryFee;

  const canPlace =
    items.length > 0 &&
    storeOpen &&
    !outOfRange &&
    (orderType === 'PICKUP' || (orderType === 'DELIVERY' && !!selectedAddressId));

  const buildPayload = () => ({
    orderType,
    items: items.map(cartItemToOrderItem),
    ...(orderType === 'DELIVERY' && selectedAddressId ? { addressId: selectedAddressId } : {}),
    ...(notes.trim() ? { notes: notes.trim() } : {}),
  });

  const handlePlace = async () => {
    if (!canPlace) return;
    setPlacing(true);
    try {
      const order = await orderService.createOrder(buildPayload());
      clearCart();
      if (paymentMethod === 'QR') {
        router.replace({ pathname: '/(cliente)/qr-payment', params: { orderId: order.id, total: grandTotal.toFixed(2) } });
      } else {
        router.replace('/(cliente)/orders');
      }
    } catch (e: any) {
      const code = e?.response?.data?.code;
      if (code === 'STORE_CLOSED') {
        refreshStore();
        Alert.alert('Tienda cerrada', e?.response?.data?.message ?? 'La tienda está cerrada en este momento.');
        return;
      }
      if (code === 'PHONE_NOT_VERIFIED') {
        router.push('/verify-phone?from=checkout');
        return;
      }
      Alert.alert('Error', e?.response?.data?.message ?? 'No se pudo crear el pedido.');
    } finally {
      setPlacing(false);
    }
  };

  return {
    items,
    totalAmount,
    grandTotal,
    storeOpen,
    storeMessage,
    orderType,
    setOrderType,
    paymentMethod,
    setPaymentMethod,
    addresses,
    loadingAddresses,
    selectedAddressId,
    setSelectedAddressId,
    selectedAddress,
    notes,
    setNotes,
    deliveryKm,
    deliveryFee,
    outOfRange,
    canPlace,
    placing,
    handlePlace,
    maxDeliveryKm: MAX_DELIVERY_KM,
    goToMenu: () => router.push('/(cliente)/menu'),
    goToAddresses: () => router.push('/(cliente)/addresses'),
  };
}
