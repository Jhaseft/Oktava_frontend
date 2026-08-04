import {
  Modal,
  View,
  Text,
  ScrollView,
  TouchableOpacity,
  Linking,
  StyleSheet,
} from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { Badge } from '@/src/components/ui/Badge';
import type { Order, OrderStatus } from '@/src/types/order.types';
import { mapsSearchUrl } from '@/src/lib/maps';
import { colors, fonts } from '@/src/theme/theme';

const STATUS_LABELS: Record<OrderStatus, string> = {
  PENDING_PAYMENT: 'Pago pendiente',
  PENDING:         'Pendiente',
  ACCEPTED:        'Aceptado',
  PREPARING:       'Preparando',
  ON_THE_WAY:      'En camino',
  PICKED_UP:       'Listo para recoger',
  PAYMENT_FAILED:  'Pago fallido',
  COMPLETED:       'Completado',
  CANCELLED:       'Cancelado',
};

const STATUS_VARIANT: Record<OrderStatus, 'default' | 'success' | 'warning' | 'danger' | 'info'> = {
  PENDING_PAYMENT: 'warning',
  PENDING:         'warning',
  ACCEPTED:        'info',
  PREPARING:       'info',
  ON_THE_WAY:      'info',
  PICKED_UP:       'success',
  PAYMENT_FAILED:  'danger',
  COMPLETED:       'success',
  CANCELLED:       'danger',
};

function formatCurrency(v: number) {
  return `Bs. ${Number(v).toFixed(0)}`;
}

function formatDate(d: string) {
  return new Intl.DateTimeFormat('es-BO', {
    day: '2-digit',
    month: 'long',
    year: 'numeric',
    hour: '2-digit',
    minute: '2-digit',
  }).format(new Date(d));
}

type Props = {
  order: Order | null;
  onClose: () => void;
};

export function OrderDetailModal({ order, onClose }: Props) {
  const insets = useSafeAreaInsets();

  return (
    <Modal
      visible={!!order}
      animationType="slide"
      presentationStyle="pageSheet"
      onRequestClose={onClose}
    >
      <View style={[styles.container, { paddingBottom: insets.bottom }]}>
        {order && (
          <>
            <View style={styles.handle} />

            <View style={styles.header}>
              <View style={styles.headerLeft}>
                <Text style={styles.orderNumber}>#{order.orderNumber}</Text>
                <Text style={styles.orderDate}>{formatDate(order.createdAt)}</Text>
              </View>
              <TouchableOpacity onPress={onClose} activeOpacity={0.7} style={styles.closeBtn}>
                <Ionicons name="close" size={20} color={colors.text} />
              </TouchableOpacity>
            </View>

            <ScrollView
              showsVerticalScrollIndicator={false}
              contentContainerStyle={styles.scrollContent}
            >
              <View style={styles.row}>
                <Badge
                  label={STATUS_LABELS[order.status] ?? order.status}
                  variant={STATUS_VARIANT[order.status] ?? 'default'}
                />
                <View style={styles.typePill}>
                  <Ionicons
                    name={order.orderType === 'DELIVERY' ? 'bicycle-outline' : 'storefront-outline'}
                    size={13}
                    color={colors.textMuted}
                  />
                  <Text style={styles.typeText}>
                    {order.orderType === 'DELIVERY' ? 'Delivery' : 'Recojo en local'}
                  </Text>
                </View>
              </View>

              {order.orderType === 'DELIVERY' && order.address && (
                <View style={styles.card}>
                  <View style={styles.cardLabelRow}>
                    <Ionicons name="location-outline" size={13} color={colors.textMuted} />
                    <Text style={styles.cardLabel}>Dirección de entrega</Text>
                  </View>
                  <Text style={styles.addressTitle}>{order.address.label}</Text>
                  {order.address.reference && (
                    <Text style={styles.addressRef}>Ref: {order.address.reference}</Text>
                  )}
                  <TouchableOpacity
                    onPress={() => Linking.openURL(mapsSearchUrl(order.address!.direction || order.address!.label)).catch(() => {})}
                    activeOpacity={0.8}
                    style={styles.mapBtn}
                  >
                    <Ionicons name="navigate" size={15} color={colors.red} />
                    <Text style={styles.mapBtnText}>Ver dirección</Text>
                  </TouchableOpacity>
                </View>
              )}

              <View style={styles.section}>
                <Text style={styles.sectionLabel}>Productos</Text>
                <View style={styles.itemsContainer}>
                  {(order.items ?? []).map((item) => (
                    <View key={item.id} style={styles.itemRow}>
                      <View style={styles.qtyBadge}>
                        <Text style={styles.qtyText}>{item.quantity}</Text>
                      </View>

                      <View style={styles.itemInfo}>
                        <Text style={styles.itemName}>{item.productName}</Text>
                        {item.selectedOptions.length > 0 && (
                          <Text style={styles.itemOptions}>
                            {item.selectedOptions.map((o) => o.optionName).join(' · ')}
                            {item.selectedOptions.some((o) => o.extraPrice > 0) && (
                              <Text style={styles.extraPrice}>
                                {'  +' + formatCurrency(
                                  item.selectedOptions.reduce((acc, o) => acc + o.extraPrice, 0)
                                )}
                              </Text>
                            )}
                          </Text>
                        )}
                        {item.notes ? (
                          <Text style={styles.itemNote}>{item.notes}</Text>
                        ) : null}
                      </View>

                      <Text style={styles.itemSubtotal}>{formatCurrency(item.subtotal)}</Text>
                    </View>
                  ))}
                </View>
              </View>

              {order.notes && (
                <View style={styles.card}>
                  <Text style={styles.cardLabel}>Instrucciones</Text>
                  <Text style={styles.notesText}>{order.notes}</Text>
                </View>
              )}

              <View style={styles.card}>
                <View style={styles.totalRow}>
                  <Text style={styles.totalLabel}>Subtotal</Text>
                  <Text style={styles.totalValue}>{formatCurrency(Number(order.subtotal))}</Text>
                </View>
                <View style={styles.totalRow}>
                  <Text style={styles.totalLabel}>Delivery</Text>
                  <Text style={[
                    styles.totalValue,
                    Number(order.deliveryFee) === 0 && { color: '#15803d' },
                  ]}>
                    {Number(order.deliveryFee) === 0
                      ? order.orderType === 'PICKUP' ? '—' : 'Gratis'
                      : formatCurrency(Number(order.deliveryFee))}
                  </Text>
                </View>
                <View style={styles.divider} />
                <View style={styles.totalRow}>
                  <Text style={styles.grandTotalLabel}>Total</Text>
                  <Text style={styles.grandTotalValue}>{formatCurrency(Number(order.total))}</Text>
                </View>
              </View>
            </ScrollView>
          </>
        )}
      </View>
    </Modal>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: colors.bg,
  },
  handle: {
    width: 36,
    height: 4,
    borderRadius: 2,
    backgroundColor: colors.borderStrong,
    alignSelf: 'center',
    marginTop: 10,
    marginBottom: 4,
  },
  header: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingHorizontal: 20,
    paddingVertical: 14,
    borderBottomWidth: 1,
    borderBottomColor: colors.border,
  },
  headerLeft: {
    gap: 2,
  },
  orderNumber: {
    fontFamily: fonts.bold,
    color: colors.text,
    fontSize: 18,
  },
  orderDate: {
    fontFamily: fonts.regular,
    color: colors.textFaint,
    fontSize: 12,
  },
  closeBtn: {
    width: 32,
    height: 32,
    borderRadius: 16,
    backgroundColor: colors.surface,
    alignItems: 'center',
    justifyContent: 'center',
  },
  scrollContent: {
    padding: 16,
    gap: 12,
  },
  row: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 10,
    flexWrap: 'wrap',
  },
  typePill: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 5,
    borderRadius: 99,
    borderWidth: 1,
    borderColor: colors.border,
    paddingHorizontal: 10,
    paddingVertical: 4,
  },
  typeText: {
    fontFamily: fonts.regular,
    color: colors.textMuted,
    fontSize: 12,
  },
  card: {
    borderRadius: 14,
    borderWidth: 1,
    borderColor: colors.border,
    backgroundColor: colors.surface,
    padding: 14,
    gap: 6,
  },
  cardLabelRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 5,
    marginBottom: 2,
  },
  cardLabel: {
    fontFamily: fonts.bold,
    color: colors.textMuted,
    fontSize: 11,
    textTransform: 'uppercase',
    letterSpacing: 0.6,
  },
  addressTitle: {
    fontFamily: fonts.bold,
    color: colors.text,
    fontSize: 14,
  },
  addressRef: {
    fontFamily: fonts.regular,
    color: colors.textFaint,
    fontSize: 12,
  },
  mapBtn: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 6,
    alignSelf: 'flex-start',
    marginTop: 8,
    borderWidth: 1,
    borderColor: colors.red,
    borderRadius: 999,
    paddingHorizontal: 14,
    paddingVertical: 8,
  },
  mapBtnText: {
    fontFamily: fonts.bold,
    color: colors.red,
    fontSize: 13,
    textTransform: 'uppercase',
    letterSpacing: 0.3,
  },
  section: {
    gap: 8,
  },
  sectionLabel: {
    fontFamily: fonts.bold,
    color: colors.textMuted,
    fontSize: 11,
    textTransform: 'uppercase',
    letterSpacing: 0.6,
  },
  itemsContainer: {
    borderRadius: 14,
    borderWidth: 1,
    borderColor: colors.border,
    backgroundColor: colors.surface,
    overflow: 'hidden',
  },
  itemRow: {
    flexDirection: 'row',
    alignItems: 'flex-start',
    gap: 10,
    padding: 12,
    borderBottomWidth: 1,
    borderBottomColor: colors.border,
  },
  qtyBadge: {
    width: 24,
    height: 24,
    borderRadius: 8,
    backgroundColor: 'rgba(193,18,31,0.12)',
    alignItems: 'center',
    justifyContent: 'center',
    marginTop: 1,
    flexShrink: 0,
  },
  qtyText: {
    fontFamily: fonts.bold,
    color: colors.red,
    fontSize: 11,
  },
  itemInfo: {
    flex: 1,
    gap: 3,
  },
  itemName: {
    fontFamily: fonts.bold,
    color: colors.text,
    fontSize: 14,
    lineHeight: 18,
  },
  itemOptions: {
    fontFamily: fonts.regular,
    color: colors.textMuted,
    fontSize: 12,
    lineHeight: 16,
  },
  extraPrice: {
    color: colors.red,
  },
  itemNote: {
    fontFamily: fonts.regular,
    color: colors.textFaint,
    fontSize: 11,
    fontStyle: 'italic',
  },
  itemSubtotal: {
    fontFamily: fonts.bold,
    color: colors.text,
    fontSize: 14,
    flexShrink: 0,
    marginTop: 1,
  },
  notesText: {
    fontFamily: fonts.regular,
    color: colors.textMuted,
    fontSize: 13,
    lineHeight: 18,
  },
  totalRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  totalLabel: {
    fontFamily: fonts.regular,
    color: colors.textMuted,
    fontSize: 13,
  },
  totalValue: {
    fontFamily: fonts.medium,
    color: colors.text,
    fontSize: 13,
  },
  divider: {
    height: 1,
    backgroundColor: colors.border,
    marginVertical: 4,
  },
  grandTotalLabel: {
    fontFamily: fonts.bold,
    color: colors.text,
    fontSize: 15,
  },
  grandTotalValue: {
    fontFamily: fonts.bold,
    color: colors.text,
    fontSize: 15,
  },
});
