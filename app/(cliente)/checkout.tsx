import { ScrollView, View } from 'react-native';
import { useCheckout } from '@/src/hooks/useCheckout';
import { Button } from '@/src/components/ui/Button';
import { PhoneVerificationModal } from '@/src/components/phone/PhoneVerificationModal';
import { CheckoutHeader } from '@/src/components/checkout/CheckoutHeader';
import { InfoBanner } from '@/src/components/checkout/InfoBanner';
import { OrderTypeSelector } from '@/src/components/checkout/OrderTypeSelector';
import { PickupSection } from '@/src/components/checkout/PickupSection';
import { DeliveryAddressSection } from '@/src/components/checkout/DeliveryAddressSection';
import { PaymentMethodSelector } from '@/src/components/checkout/PaymentMethodSelector';
import { CheckoutNotes } from '@/src/components/checkout/CheckoutNotes';
import { CheckoutSummary } from '@/src/components/checkout/CheckoutSummary';

export default function CheckoutScreen() {
  const c = useCheckout();

  return (
    <>
      <PhoneVerificationModal
        visible={c.showOtpModal}
        onVerified={c.handlePhoneVerified}
        onClose={() => c.setShowOtpModal(false)}
      />
      <ScrollView className="flex-1 bg-white" keyboardShouldPersistTaps="handled">
        <View className="px-5 pt-14 pb-8 gap-6">
          <CheckoutHeader onBack={c.goToMenu} />

          {!c.storeOpen && (
            <InfoBanner
              variant="error"
              message={c.storeMessage || 'La tienda está cerrada. No puedes hacer pedidos en este momento.'}
            />
          )}

          {c.phoneJustVerified && (
            <InfoBanner variant="success" message="✓ Número verificado. Ya puedes confirmar tu pedido." />
          )}

          <OrderTypeSelector value={c.orderType} onChange={c.setOrderType} />

          {c.orderType === 'PICKUP' && <PickupSection />}

          {c.orderType === 'DELIVERY' && (
            <DeliveryAddressSection
              addresses={c.addresses}
              loading={c.loadingAddresses}
              selectedId={c.selectedAddressId}
              onSelect={c.setSelectedAddressId}
              onManage={c.goToAddresses}
            />
          )}

          <PaymentMethodSelector value={c.paymentMethod} onChange={c.setPaymentMethod} />

          <CheckoutNotes value={c.notes} onChange={c.setNotes} />

          {c.outOfRange && (
            <InfoBanner
              variant="error"
              message={`La dirección está fuera del área de cobertura (${c.deliveryKm.toFixed(1)} km). Máximo ${c.maxDeliveryKm} km.`}
            />
          )}

          <CheckoutSummary
            items={c.items}
            totalAmount={c.totalAmount}
            grandTotal={c.grandTotal}
            orderType={c.orderType}
            outOfRange={c.outOfRange}
            selectedAddress={c.selectedAddress}
            deliveryFee={c.deliveryFee}
            paymentMethod={c.paymentMethod}
          />

          <Button label="Confirmar pedido" onPress={c.handlePlace} loading={c.placing} disabled={!c.canPlace} />
        </View>
      </ScrollView>
    </>
  );
}
