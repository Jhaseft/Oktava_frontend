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

  const finder = (row: number, col: number) => {
    for (let r = 0; r < 7; r++) {
      for (let c = 0; c < 7; c++) {
        const border  = r === 0 || r === 6 || c === 0 || c === 6;
        const center  = r >= 2 && r <= 4 && c >= 2 && c <= 4;
        g[row + r][col + c] = border || center;
      }
    }
  };

  finder(0, 0);
  finder(0, 14);
  finder(14, 0);

  for (let i = 8; i <= 12; i++) {
    g[6][i] = i % 2 === 0;
    g[i][6] = i % 2 === 0;
  }

  g[13][8] = true;

  for (let r = 0; r < QR_SIZE; r++) {
    for (let c = 0; c < QR_SIZE; c++) {
      if (r <= 7 && c <= 7)  continue;
      if (r <= 7 && c >= 13) continue;
      if (r >= 13 && c <= 7) continue;
      if (r === 6 || c === 6) continue;
      g[r][c] = ((r * 13 + c * 7 + r * c * 3 + r ^ c) % 11) < 5;
    }
  }

  return g;
}

const QR_PATTERN = buildQRPattern();
const QR_PX = QR_SIZE * MODULE_PX;

function QRCode() {
  return (
    <View className="bg-white p-4 rounded-xl">
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

const EXPIRE_SECONDS = 5 * 60;

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
    <LinearGradient colors={['#0a0a0a', '#000000']} className="flex-1">
      <ScrollView
        contentContainerStyle={{ flexGrow: 1, alignItems: 'center', paddingHorizontal: 24, paddingTop: 60, paddingBottom: 40 }}
        showsVerticalScrollIndicator={false}
      >
        {/* Badge simulación */}
        <View className="bg-[rgba(234,179,8,0.15)] border border-[rgba(234,179,8,0.4)] rounded-full px-3 py-1 mb-6">
          <Text
            className="text-yellow-300 text-[11px] font-bold"
            style={{ letterSpacing: 1 }}
          >
            SIMULACIÓN — SIN API BANCARIA
          </Text>
        </View>

        {/* Título */}
        <Text className="text-white text-2xl font-extrabold mb-1">
          Pago por QR
        </Text>
        <Text className="text-zinc-500 text-[13px] mb-2">
          Pedido #{orderId?.slice(-8).toUpperCase()}
        </Text>

        {/* Monto */}
        <Text className="text-red-500 text-4xl font-black mb-7">
          Bs. {total}
        </Text>

        {/* QR */}
        {expired ? (
          <View
            className="bg-[#1c1c1e] rounded-xl items-center justify-center gap-2.5"
            style={{ width: QR_PX + 32, height: QR_PX + 32 }}
          >
            <Ionicons name="time-outline" size={40} color="#ef4444" />
            <Text className="text-red-500 font-bold text-sm">QR expirado</Text>
          </View>
        ) : (
          <QRCode />
        )}

        {/* Countdown */}
        <View className="flex-row items-center gap-1.5 mt-4 mb-7">
          <Ionicons name="time-outline" size={14} color={expired ? '#ef4444' : '#71717a'} />
          <Text className={`text-[13px] ${expired ? 'text-red-500' : 'text-zinc-500'}`}>
            {expired ? 'El código expiró' : `Expira en ${minutes}:${seconds}`}
          </Text>
        </View>

        {/* Instrucción */}
        {!expired && (
          <Text className="text-zinc-600 text-xs text-center mb-8 leading-[18px]">
            Escanea este código con tu aplicación bancaria{'\n'}para completar el pago
          </Text>
        )}

        {/* Botón simular pago */}
        {!expired && (
          <Pressable
            onPress={handleSimulatePaid}
            className="w-full h-[50px] rounded-xl bg-green-600 active:bg-green-700 items-center justify-center flex-row gap-2 mb-3"
          >
            <Ionicons name="checkmark-circle-outline" size={20} color="#fff" />
            <Text className="text-white font-bold text-[15px]">
              Simular pago completado
            </Text>
          </Pressable>
        )}

        {/* Volver a pedidos */}
        <Pressable onPress={() => router.replace('/(cliente)/orders')}>
          <Text className="text-zinc-500 text-[13px] underline">
            Ver mis pedidos
          </Text>
        </Pressable>
      </ScrollView>
    </LinearGradient>
  );
}
