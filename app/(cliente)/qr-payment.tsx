import { useEffect, useState } from 'react';
import { View, Text, Pressable, ScrollView } from 'react-native';
import { router, useLocalSearchParams } from 'expo-router';
import { LinearGradient } from 'expo-linear-gradient';
import Svg, { Rect } from 'react-native-svg';
import { Ionicons } from '@expo/vector-icons';

// ─── QR simulado (21×21, patrón fijo) ────────────────────────────────────────

const QR_SIZE = 21;
const MODULE_PX = 13;

function buildQRPattern(): boolean[][] {
  const g: boolean[][] = Array.from({ length: QR_SIZE }, () =>
    new Array(QR_SIZE).fill(false),
  );

  // Finder pattern (7×7): borde negro, anillo blanco, centro negro 3×3
  const finder = (row: number, col: number) => {
    for (let r = 0; r < 7; r++) {
      for (let c = 0; c < 7; c++) {
        const border  = r === 0 || r === 6 || c === 0 || c === 6;
        const center  = r >= 2 && r <= 4 && c >= 2 && c <= 4;
        g[row + r][col + c] = border || center;
      }
    }
  };

  finder(0, 0);   // esquina superior-izquierda
  finder(0, 14);  // esquina superior-derecha
  finder(14, 0);  // esquina inferior-izquierda

  // Timing patterns (fila 6 / columna 6 entre finders)
  for (let i = 8; i <= 12; i++) {
    g[6][i] = i % 2 === 0;
    g[i][6] = i % 2 === 0;
  }

  // Módulo oscuro obligatorio
  g[13][8] = true;

  // Datos simulados: patrón determinista que parece aleatorio
  for (let r = 0; r < QR_SIZE; r++) {
    for (let c = 0; c < QR_SIZE; c++) {
      if (r <= 7 && c <= 7)  continue; // finder TL + separador
      if (r <= 7 && c >= 13) continue; // finder TR + separador
      if (r >= 13 && c <= 7) continue; // finder BL + separador
      if (r === 6 || c === 6) continue; // timing
      g[r][c] = ((r * 13 + c * 7 + r * c * 3 + r ^ c) % 11) < 5;
    }
  }

  return g;
}

const QR_PATTERN = buildQRPattern();
const QR_PX = QR_SIZE * MODULE_PX;

function QRCode() {
  return (
    <View style={{ backgroundColor: '#fff', padding: 16, borderRadius: 12 }}>
      <Svg width={QR_PX} height={QR_PX}>
        <Rect x={0} y={0} width={QR_PX} height={QR_PX} fill="white" />
        {QR_PATTERN.map((row, r) =>
          row.map((filled, c) =>
            filled ? (
              <Rect
                key={`${r}-${c}`}
                x={c * MODULE_PX}
                y={r * MODULE_PX}
                width={MODULE_PX}
                height={MODULE_PX}
                fill="black"
              />
            ) : null,
          ),
        )}
      </Svg>
    </View>
  );
}

// ─── Pantalla ─────────────────────────────────────────────────────────────────

const EXPIRE_SECONDS = 5 * 60; // 5 minutos

export default function QRPaymentScreen() {
  const { orderId, total } = useLocalSearchParams<{ orderId: string; total: string }>();
  const [secondsLeft, setSecondsLeft] = useState(EXPIRE_SECONDS);
  const [simulated, setSimulated] = useState(false);

  useEffect(() => {
    if (secondsLeft <= 0 || simulated) return;
    const id = setInterval(() => setSecondsLeft((s) => s - 1), 1000);
    return () => clearInterval(id);
  }, [secondsLeft, simulated]);

  const minutes = String(Math.floor(secondsLeft / 60)).padStart(2, '0');
  const seconds = String(secondsLeft % 60).padStart(2, '0');
  const expired  = secondsLeft <= 0;

  const handleSimulatePaid = () => {
    setSimulated(true);
    router.replace('/(cliente)/orders');
  };

  return (
    <LinearGradient colors={['#0a0a0a', '#000000']} style={{ flex: 1 }}>
      <ScrollView
        contentContainerStyle={{ flexGrow: 1, alignItems: 'center', paddingHorizontal: 24, paddingTop: 60, paddingBottom: 40 }}
        showsVerticalScrollIndicator={false}
      >
        {/* Badge simulación */}
        <View style={{
          backgroundColor: 'rgba(234,179,8,0.15)',
          borderWidth: 1,
          borderColor: 'rgba(234,179,8,0.4)',
          borderRadius: 20,
          paddingHorizontal: 12,
          paddingVertical: 4,
          marginBottom: 24,
        }}>
          <Text style={{ color: '#facc15', fontSize: 11, fontWeight: '700', letterSpacing: 1 }}>
            SIMULACIÓN — SIN API BANCARIA
          </Text>
        </View>

        {/* Título */}
        <Text style={{ color: '#ffffff', fontSize: 24, fontWeight: '800', marginBottom: 4 }}>
          Pago por QR
        </Text>
        <Text style={{ color: '#71717a', fontSize: 13, marginBottom: 8 }}>
          Pedido #{orderId?.slice(-8).toUpperCase()}
        </Text>

        {/* Monto */}
        <Text style={{ color: '#ef4444', fontSize: 36, fontWeight: '900', marginBottom: 28 }}>
          Bs. {total}
        </Text>

        {/* QR */}
        {expired ? (
          <View style={{
            width: QR_PX + 32,
            height: QR_PX + 32,
            borderRadius: 12,
            backgroundColor: '#1c1c1e',
            alignItems: 'center',
            justifyContent: 'center',
            gap: 10,
          }}>
            <Ionicons name="time-outline" size={40} color="#ef4444" />
            <Text style={{ color: '#ef4444', fontWeight: '700', fontSize: 14 }}>QR expirado</Text>
          </View>
        ) : (
          <QRCode />
        )}

        {/* Countdown */}
        <View style={{ flexDirection: 'row', alignItems: 'center', gap: 6, marginTop: 16, marginBottom: 28 }}>
          <Ionicons name="time-outline" size={14} color={expired ? '#ef4444' : '#71717a'} />
          <Text style={{ color: expired ? '#ef4444' : '#71717a', fontSize: 13 }}>
            {expired ? 'El código expiró' : `Expira en ${minutes}:${seconds}`}
          </Text>
        </View>

        {/* Instrucción */}
        {!expired && (
          <Text style={{ color: '#52525b', fontSize: 12, textAlign: 'center', marginBottom: 32, lineHeight: 18 }}>
            Escanea este código con tu aplicación bancaria{'\n'}para completar el pago
          </Text>
        )}

        {/* Botón simular pago */}
        {!expired && (
          <Pressable
            onPress={handleSimulatePaid}
            style={({ pressed }) => ({
              width: '100%',
              height: 50,
              borderRadius: 12,
              backgroundColor: pressed ? '#15803d' : '#16a34a',
              alignItems: 'center',
              justifyContent: 'center',
              flexDirection: 'row',
              gap: 8,
              marginBottom: 12,
            })}
          >
            <Ionicons name="checkmark-circle-outline" size={20} color="#fff" />
            <Text style={{ color: '#fff', fontWeight: '700', fontSize: 15 }}>
              Simular pago completado
            </Text>
          </Pressable>
        )}

        {/* Volver a pedidos */}
        <Pressable onPress={() => router.replace('/(cliente)/orders')}>
          <Text style={{ color: '#71717a', fontSize: 13, textDecorationLine: 'underline' }}>
            Ver mis pedidos
          </Text>
        </Pressable>
      </ScrollView>
    </LinearGradient>
  );
}
