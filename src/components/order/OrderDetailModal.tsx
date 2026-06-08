import {
  Modal,
  View,
  Text,
  ScrollView,
  TouchableOpacity,
  StyleSheet,
} from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { Badge } from '@/src/components/ui/Badge';
import type { Order, OrderStatus } from '@/src/types/order.types';

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
            {/* Handle bar */}
            <View style={styles.handle} />

            {/* Header */}
            <View style={styles.header}>
              <View style={styles.headerLeft}>
                <Text style={styles.orderNumber}>#{order.orderNumber}</Text>
                <Text style={styles.orderDate}>{formatDate(order.createdAt)}</Text>
              </View>
              <TouchableOpacity onPress={onClose} activeOpacity={0.7} style={styles.closeBtn}>
                <Ionicons name="close" size={20} color="#a1a1aa" />
              </TouchableOpacity>
            </View>

            <ScrollView
              showsVerticalScrollIndicator={false}
              contentContainerStyle={styles.scrollContent}
            >
              {/* Status + Type row */}
              <View style={styles.row}>
                <Badge
                  label={STATUS_LABELS[order.status]}
                  variant={STATUS_VARIANT[order.status]}
                />
                <View style={styles.typePill}>
                  <Ionicons
                    name={order.orderType === 'DELIVERY' ? 'bicycle-outline' : 'storefront-outline'}
                    size={13}
                    color="#a1a1aa"
                  />
                  <Text style={styles.typeText}>
                    {order.orderType === 'DELIVERY' ? 'Delivery' : 'Recojo en local'}
                  </Text>
                </View>
              </View>

              {/* Address */}
              {order.orderType === 'DELIVERY' && order.address && (
                <View style={styles.card}>
                  <View style={styles.cardLabelRow}>
                    <Ionicons name="location-outline" size={13} color="#a1a1aa" />
                    <Text style={styles.cardLabel}>Dirección de entrega</Text>
                  </View>
                  <Text style={styles.addressTitle}>{order.address.label}</Text>
                  <Text style={styles.addressSub}>{order.address.direction}</Text>
                  {order.address.reference && (
                    <Text style={styles.addressRef}>Ref: {order.address.reference}</Text>
                  )}
                </View>
              )}

              {/* Items */}
              <View style={styles.section}>
                <Text style={styles.sectionLabel}>Productos</Text>
                <View style={styles.itemsContainer}>
                  {(order.items ?? []).map((item) => (
                    <View key={item.id} style={styles.itemRow}>
                      {/* Qty badge */}
                      <View style={styles.qtyBadge}>
                        <Text style={styles.qtyText}>{item.quantity}</Text>
                      </View>

                      {/* Name + options */}
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

                      {/* Subtotal */}
                      <Text style={styles.itemSubtotal}>{formatCurrency(item.subtotal)}</Text>
                    </View>
                  ))}
                </View>
              </View>

              {/* Notes */}
              {order.notes && (
                <View style={styles.card}>
                  <Text style={styles.cardLabel}>Instrucciones</Text>
                  <Text style={styles.notesText}>{order.notes}</Text>
                </View>
              )}

              {/* Totals */}
              <View style={styles.card}>
                <View style={styles.totalRow}>
                  <Text style={styles.totalLabel}>Subtotal</Text>
                  <Text style={styles.totalValue}>{formatCurrency(Number(order.subtotal))}</Text>
                </View>
                <View style={styles.totalRow}>
                  <Text style={styles.totalLabel}>Delivery</Text>
                  <Text style={[
                    styles.totalValue,
                    Number(order.deliveryFee) === 0 && { color: '#4ade80' },
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
    backgroundColor: '#0a0a0a',
  },
  handle: {
    width: 36,
    height: 4,
    borderRadius: 2,
    backgroundColor: '#3f3f46',
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
    borderBottomColor: 'rgba(255,255,255,0.07)',
  },
  headerLeft: {
    gap: 2,
  },
  orderNumber: {
    color: '#ffffff',
    fontSize: 18,
    fontWeight: '800',
  },
  orderDate: {
    color: '#71717a',
    fontSize: 12,
  },
  closeBtn: {
    width: 32,
    height: 32,
    borderRadius: 16,
    backgroundColor: 'rgba(255,255,255,0.07)',
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
    borderColor: 'rgba(255,255,255,0.10)',
    paddingHorizontal: 10,
    paddingVertical: 4,
  },
  typeText: {
    color: '#a1a1aa',
    fontSize: 12,
  },
  card: {
    borderRadius: 14,
    borderWidth: 1,
    borderColor: 'rgba(255,255,255,0.07)',
    backgroundColor: 'rgba(255,255,255,0.03)',
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
    color: '#71717a',
    fontSize: 11,
    fontWeight: '600',
    textTransform: 'uppercase',
    letterSpacing: 0.6,
  },
  addressTitle: {
    color: '#ffffff',
    fontSize: 14,
    fontWeight: '600',
  },
  addressSub: {
    color: '#a1a1aa',
    fontSize: 13,
  },
  addressRef: {
    color: '#71717a',
    fontSize: 12,
  },
  section: {
    gap: 8,
  },
  sectionLabel: {
    color: '#71717a',
    fontSize: 11,
    fontWeight: '600',
    textTransform: 'uppercase',
    letterSpacing: 0.6,
  },
  itemsContainer: {
    borderRadius: 14,
    borderWidth: 1,
    borderColor: 'rgba(255,255,255,0.07)',
    backgroundColor: 'rgba(255,255,255,0.03)',
    overflow: 'hidden',
  },
  itemRow: {
    flexDirection: 'row',
    alignItems: 'flex-start',
    gap: 10,
    padding: 12,
    borderBottomWidth: 1,
    borderBottomColor: 'rgba(255,255,255,0.05)',
  },
  qtyBadge: {
    width: 24,
    height: 24,
    borderRadius: 8,
    backgroundColor: 'rgba(229,9,9,0.18)',
    alignItems: 'center',
    justifyContent: 'center',
    marginTop: 1,
    flexShrink: 0,
  },
  qtyText: {
    color: '#fca5a5',
    fontSize: 11,
    fontWeight: '800',
  },
  itemInfo: {
    flex: 1,
    gap: 3,
  },
  itemName: {
    color: '#ffffff',
    fontSize: 14,
    fontWeight: '600',
    lineHeight: 18,
  },
  itemOptions: {
    color: '#71717a',
    fontSize: 12,
    lineHeight: 16,
  },
  extraPrice: {
    color: '#f87171',
  },
  itemNote: {
    color: '#52525b',
    fontSize: 11,
    fontStyle: 'italic',
  },
  itemSubtotal: {
    color: '#ffffff',
    fontSize: 14,
    fontWeight: '700',
    flexShrink: 0,
    marginTop: 1,
  },
  notesText: {
    color: '#d4d4d8',
    fontSize: 13,
    lineHeight: 18,
  },
  totalRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  totalLabel: {
    color: '#a1a1aa',
    fontSize: 13,
  },
  totalValue: {
    color: '#ffffff',
    fontSize: 13,
  },
  divider: {
    height: 1,
    backgroundColor: 'rgba(255,255,255,0.07)',
    marginVertical: 4,
  },
  grandTotalLabel: {
    color: '#ffffff',
    fontSize: 15,
    fontWeight: '700',
  },
  grandTotalValue: {
    color: '#ffffff',
    fontSize: 15,
    fontWeight: '800',
  },
});
