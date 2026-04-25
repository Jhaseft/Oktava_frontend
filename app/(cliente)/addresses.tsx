import { useEffect, useState, useCallback } from 'react';
import { View, Text, ScrollView, RefreshControl, Alert, Modal } from 'react-native';
import { router } from 'expo-router';
import { Ionicons } from '@expo/vector-icons';
import { addressService } from '@/src/services/address.service';
import { AddressCard } from '@/src/components/address/AddressCard';
import { AddressForm } from '@/src/components/address/AddressForm';
import { Button } from '@/src/components/ui/Button';
import { LoadingState } from '@/src/components/ui/LoadingState';
import { EmptyState } from '@/src/components/ui/EmptyState';
import type { Address, CreateAddressDto, UpdateAddressDto } from '@/src/types/address.types';
import { TouchableOpacity } from 'react-native';

const EMPTY_FORM: CreateAddressDto = { street: '', city: '', reference: undefined, isDefault: false };

export default function AddressesScreen() {
  const [addresses, setAddresses] = useState<Address[]>([]);
  const [loading, setLoading] = useState(true);
  const [refreshing, setRefreshing] = useState(false);
  const [saving, setSaving] = useState(false);
  const [modalVisible, setModalVisible] = useState(false);
  const [editingId, setEditingId] = useState<string | null>(null);
  const [form, setForm] = useState<CreateAddressDto>(EMPTY_FORM);

  const fetchAddresses = useCallback(async () => {
    try {
      const data = await addressService.getAddresses();
      setAddresses(data);
    } catch {}
  }, []);

  useEffect(() => {
    fetchAddresses().finally(() => setLoading(false));
  }, [fetchAddresses]);

  const onRefresh = useCallback(async () => {
    setRefreshing(true);
    await fetchAddresses();
    setRefreshing(false);
  }, [fetchAddresses]);

  const openCreate = () => {
    setEditingId(null);
    setForm(EMPTY_FORM);
    setModalVisible(true);
  };

  const openEdit = (addr: Address) => {
    setEditingId(addr.id);
    setForm({ street: addr.street, city: addr.city, reference: addr.reference ?? undefined, isDefault: addr.isDefault });
    setModalVisible(true);
  };

  const handleSave = async () => {
    if (!form.street.trim() || !form.city.trim()) return;
    setSaving(true);
    try {
      if (editingId) {
        const updated = await addressService.updateAddress(editingId, form as UpdateAddressDto);
        setAddresses((prev) => prev.map((a) => (a.id === editingId ? updated : a)));
      } else {
        const created = await addressService.createAddress(form);
        setAddresses((prev) => [...prev, created]);
      }
      setModalVisible(false);
    } catch (e: any) {
      Alert.alert('Error', e?.response?.data?.message ?? 'No se pudo guardar la dirección.');
    } finally {
      setSaving(false);
    }
  };

  const handleDelete = (id: string) => {
    Alert.alert('Eliminar', '¿Eliminar esta dirección?', [
      { text: 'Cancelar', style: 'cancel' },
      {
        text: 'Eliminar',
        style: 'destructive',
        onPress: async () => {
          try {
            await addressService.deleteAddress(id);
            setAddresses((prev) => prev.filter((a) => a.id !== id));
          } catch {
            Alert.alert('Error', 'No se pudo eliminar la dirección.');
          }
        },
      },
    ]);
  };

  if (loading) return <LoadingState message="Cargando direcciones..." />;

  return (
    <View className="flex-1 bg-black">
      <View className="px-5 pt-14 pb-4 flex-row items-center justify-between">
        <View className="flex-row items-center gap-3">
          <TouchableOpacity onPress={() => router.back()} activeOpacity={0.7}>
            <Ionicons name="arrow-back" size={22} color="#fff" />
          </TouchableOpacity>
          <Text className="text-white text-2xl font-bold">Direcciones</Text>
        </View>
        <TouchableOpacity
          onPress={openCreate}
          activeOpacity={0.7}
          className="bg-red-500 rounded-xl px-3 py-2"
        >
          <Text className="text-white font-semibold text-sm">+ Agregar</Text>
        </TouchableOpacity>
      </View>

      <ScrollView
        className="flex-1 px-5"
        refreshControl={<RefreshControl refreshing={refreshing} onRefresh={onRefresh} tintColor="#ef4444" />}
        contentContainerStyle={{ gap: 10, paddingBottom: 24 }}
      >
        {addresses.length === 0 ? (
          <View className="mt-20">
            <EmptyState title="Sin direcciones" description="Agrega una dirección para pedidos delivery." />
          </View>
        ) : (
          addresses.map((addr) => (
            <AddressCard
              key={addr.id}
              address={addr}
              onEdit={() => openEdit(addr)}
              onDelete={() => handleDelete(addr.id)}
            />
          ))
        )}
      </ScrollView>

      <Modal visible={modalVisible} animationType="slide" presentationStyle="pageSheet" onRequestClose={() => setModalVisible(false)}>
        <View className="flex-1 bg-black px-5 pt-10 pb-8">
          <View className="flex-row items-center justify-between mb-6">
            <Text className="text-white text-xl font-bold">
              {editingId ? 'Editar dirección' : 'Nueva dirección'}
            </Text>
            <TouchableOpacity onPress={() => setModalVisible(false)} activeOpacity={0.7}>
              <Ionicons name="close" size={24} color="#a1a1aa" />
            </TouchableOpacity>
          </View>
          <AddressForm
            value={form}
            onChange={setForm}
            onSubmit={handleSave}
            loading={saving}
            submitLabel={editingId ? 'Guardar cambios' : 'Agregar dirección'}
          />
        </View>
      </Modal>
    </View>
  );
}
