import { LoadingState } from '@/src/components/ui/LoadingState';
import { AddressListView } from '@/src/components/address/AddressListView';
import { AddressMapPicker } from '@/src/components/address/AddressMapPicker';
import { AddressDetailsForm } from '@/src/components/address/AddressDetailsForm';
import { useAddressManager } from '@/src/hooks/useAddressManager';

export default function AddressesScreen() {
  const a = useAddressManager();

  if (a.loading) return <LoadingState message="Cargando direcciones..." />;

  if (a.view === 'picker') {
    return (
      <AddressMapPicker
        ref={a.mapRef}
        isEditing={a.isEditing}
        initialRegion={a.pickerStart}
        outOfRange={a.outOfRange}
        onRegionChangeComplete={a.onRegionChangeComplete}
        onBack={a.goToList}
        onRecenter={a.recenterToMe}
        onConfirm={a.confirmLocation}
      />
    );
  }

  if (a.view === 'form') {
    return (
      <AddressDetailsForm
        isEditing={a.isEditing}
        label={a.label}
        setLabel={a.setLabel}
        direction={a.direction}
        setDirection={a.setDirection}
        reference={a.reference}
        setReference={a.setReference}
        saving={a.saving}
        onBack={a.goToList}
        onSave={a.handleSave}
      />
    );
  }

  return (
    <AddressListView
      addresses={a.addresses}
      onBack={a.goBack}
      onAdd={a.openAdd}
      onPressAddress={a.onCardPress}
      onDelete={a.handleDelete}
    />
  );
}
