import { useCallback, useMemo, useRef, useState } from 'react';
import {
  ActivityIndicator,
  Alert,
  StyleSheet,
  Text,
  View,
} from 'react-native';
import { router, useLocalSearchParams } from 'expo-router';
import WebView, { type WebViewMessageEvent } from 'react-native-webview';
import { LinearGradient } from 'expo-linear-gradient';
import { paymentService } from '@/src/services/payment.service';
import { useCart } from '@/src/context/CartContext';

// ─── Tipos ────────────────────────────────────────────────────────────────────

type RouteParams = {
  orderId: string;
  orderNumber: string;
  sessionKey: string;
  merchantId: string;
  purchaseNumber: string;
  amount: string;
  currency: string;
};

type NiubizMessage =
  | { type: 'NIUBIZ_TOKEN'; transactionToken: string }
  | { type: 'NIUBIZ_CANCEL' }
  | { type: 'NIUBIZ_ERROR'; message: string };

// ─── HTML del widget ──────────────────────────────────────────────────────────

function buildNiubizHtml(opts: {
  sessionKey: string;
  merchantId: string;
  purchaseNumber: string;
  amount: string;
  scriptUrl: string;
}): string {
  return `<!DOCTYPE html>
<html>
<head>
  <meta charset="UTF-8">
  <meta name="viewport" content="width=device-width, initial-scale=1.0, maximum-scale=1.0, user-scalable=no">
  <title>Pago seguro</title>
  <style>
    * { box-sizing: border-box; margin: 0; padding: 0; }
    body {
      background: #09090b;
      display: flex;
      flex-direction: column;
      align-items: center;
      justify-content: center;
      min-height: 100vh;
      font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', sans-serif;
    }
    .status { font-size: 15px; color: #a1a1aa; text-align: center; padding: 0 24px; }
    .error  { color: #ef4444; }
  </style>
</head>
<body>
  <p class="status" id="status">Cargando formulario de pago seguro…</p>
  <script src="${opts.scriptUrl}"></script>
  <script>
    window.addEventListener('load', function () {
      try {
        if (typeof VisanetCheckout === 'undefined') {
          document.getElementById('status').textContent = 'Error: no se pudo cargar el formulario de pago. Verifica tu conexión.';
          document.getElementById('status').className = 'status error';
          window.ReactNativeWebView.postMessage(JSON.stringify({
            type: 'NIUBIZ_ERROR',
            message: 'No se pudo cargar el widget de Niubiz. Verifica tu conexión a internet.'
          }));
          return;
        }

        VisanetCheckout.configure({
          sessiontoken: '${opts.sessionKey}',
          channel: 'web',
          merchantid: '${opts.merchantId}',
          purchasenumber: '${opts.purchaseNumber}',
          amount: '${opts.amount}',
          currency: 'PEN',
          complete: function (params) {
            window.ReactNativeWebView.postMessage(JSON.stringify({
              type: 'NIUBIZ_TOKEN',
              transactionToken: params.transactionToken
            }));
          },
          cancel: function () {
            window.ReactNativeWebView.postMessage(JSON.stringify({ type: 'NIUBIZ_CANCEL' }));
          }
        });

        VisanetCheckout.open();
        document.getElementById('status').style.display = 'none';
      } catch (e) {
        document.getElementById('status').textContent = 'Error al inicializar: ' + e.message;
        document.getElementById('status').className = 'status error';
        window.ReactNativeWebView.postMessage(JSON.stringify({
          type: 'NIUBIZ_ERROR',
          message: e.message
        }));
      }
    });
  </script>
</body>
</html>`;
}

// ─── Pantalla ─────────────────────────────────────────────────────────────────

export default function NiubizPaymentScreen() {
  const params = useLocalSearchParams<RouteParams>();
  const { clearCart } = useCart();
  const [authorizing, setAuthorizing] = useState(false);
  const webViewRef = useRef(null);

  // La URL del script usa el merchantId real en lugar del placeholder.
  const scriptUrl = useMemo(
    () => `https://static.niubiz.com.pe/apiform/${params.merchantId}/js/main.min.js`,
    [params.merchantId],
  );

  const html = useMemo(
    () =>
      buildNiubizHtml({
        sessionKey: params.sessionKey,
        merchantId: params.merchantId,
        purchaseNumber: params.purchaseNumber,
        amount: params.amount,
        scriptUrl,
      }),
    // Calculado una sola vez al montar la pantalla.
    // eslint-disable-next-line react-hooks/exhaustive-deps
    [],
  );

  const handleMessage = useCallback(
    async (event: WebViewMessageEvent) => {
      let msg: NiubizMessage;
      try {
        msg = JSON.parse(event.nativeEvent.data) as NiubizMessage;
      } catch {
        return;
      }

      if (msg.type === 'NIUBIZ_CANCEL') {
        // El usuario canceló — volver al checkout con el carrito intacto.
        // La orden queda en PENDING_PAYMENT (limpieza futura por job).
        router.back();
        return;
      }

      if (msg.type === 'NIUBIZ_ERROR') {
        Alert.alert('Error de pago', msg.message, [
          { text: 'Volver al checkout', onPress: () => router.back() },
        ]);
        return;
      }

      if (msg.type === 'NIUBIZ_TOKEN') {
        setAuthorizing(true);
        try {
          // El backend busca el Payment por orderId, autoriza en Niubiz y actualiza
          // Payment→paid + Order→PENDING en una sola transacción.
          // El frontend NO crea la orden ni envía el monto.
          const result = await paymentService.authorizeNiubizPayment({
            orderId: params.orderId,
            transactionToken: msg.transactionToken,
          });

          if (result.success) {
            clearCart();
            router.replace('/(cliente)/orders');
          } else {
            setAuthorizing(false);
            Alert.alert(
              'Pago rechazado',
              'El banco rechazó el pago. Puedes intentar con otra tarjeta o elegir otro método.',
              [
                { text: 'Reintentar', style: 'default', onPress: () => router.back() },
                { text: 'Volver al carrito', style: 'cancel', onPress: () => router.back() },
              ],
            );
          }
        } catch (e: any) {
          const message =
            e?.response?.data?.message ??
            e?.message ??
            'El pago no pudo ser procesado. Intenta nuevamente.';
          setAuthorizing(false);
          Alert.alert('Error de pago', message, [
            { text: 'Volver al checkout', style: 'cancel', onPress: () => router.back() },
          ]);
        }
      }
    },
    [params.orderId, clearCart],
  );

  // ─── Pantalla de espera mientras se autoriza ───────────────────────────────

  if (authorizing) {
    return (
      <LinearGradient colors={['#0a0a0a', '#000000']} style={styles.center}>
        <ActivityIndicator size="large" color="#ef4444" />
        <Text style={styles.authorizingText}>Procesando pago…</Text>
        <Text style={styles.authorizingSubtext}>No cierres la aplicación</Text>
      </LinearGradient>
    );
  }

  // ─── Pantalla principal: WebView con el widget de Niubiz ──────────────────

  return (
    <View style={styles.container}>
      {/* Badge de sandbox — visible sobre el WebView */}
      <View style={styles.sandboxBadge}>
        <Text style={styles.sandboxText}>SANDBOX — SIN COBRO REAL</Text>
      </View>

      <WebView
        ref={webViewRef}
        source={{ html }}
        originWhitelist={['*']}
        javaScriptEnabled
        onMessage={handleMessage}
        style={styles.webview}
        mixedContentMode="compatibility"
        setSupportMultipleWindows={false}
      />
    </View>
  );
}

// ─── Estilos ──────────────────────────────────────────────────────────────────

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#09090b',
  },
  center: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
    gap: 12,
  },
  webview: {
    flex: 1,
  },
  sandboxBadge: {
    alignSelf: 'center',
    marginTop: 48,
    marginBottom: 4,
    backgroundColor: 'rgba(234, 179, 8, 0.15)',
    borderColor: 'rgba(234, 179, 8, 0.4)',
    borderWidth: 1,
    borderRadius: 20,
    paddingHorizontal: 12,
    paddingVertical: 4,
  },
  sandboxText: {
    color: '#fde047',
    fontSize: 11,
    fontWeight: '700',
    letterSpacing: 1,
  },
  authorizingText: {
    color: '#ffffff',
    fontSize: 16,
    fontWeight: '600',
  },
  authorizingSubtext: {
    color: '#71717a',
    fontSize: 13,
  },
});
