import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";
import Link from "next/link";
import {
  Smartphone,
  MessageCircle,
  Wallet,
  BarChart3,
  ShoppingBag,
  Search,
  Globe,
  CheckCircle,
  ChevronRight,
  Camera,
  X,
} from "lucide-react";

const WHATSAPP_NUMBER = process.env.NEXT_PUBLIC_WHATSAPP || "51999999999";

const features = [
  {
    icon: ShoppingBag,
    title: "Catálogo web profesional",
    desc: "Tus productos con fotos, precios y stock. Tus clientes ven todo al instante, sin preguntar.",
  },
  {
    icon: MessageCircle,
    title: "WhatsApp integrado",
    desc: "Cada producto tiene un botón que abre WhatsApp con la información lista. Consulta en 1 clic.",
  },
  {
    icon: Wallet,
    title: "Pago con Yape",
    desc: "El cliente copia tu número, paga desde su app, y envía el comprobante. Sin comisiones.",
  },
  {
    icon: BarChart3,
    title: "Panel administrador",
    desc: "Agrega, edita o elimina productos. Controla stock, precios y ofertas desde tu celular o PC.",
  },
  {
    icon: Camera,
    title: "Escáner de código de barras",
    desc: "Escanea el código del producto con tu cámara para buscar y actualizar stock al instante.",
  },
  {
    icon: Globe,
    title: "Compartible en redes",
    desc: "Envía el link por WhatsApp, TikTok o Instagram. Tus clientes ven el catálogo sin descargar nada.",
  },
  {
    icon: Search,
    title: "Aparece en Google",
    desc: "Tu catálogo se posiciona en Google. Clientes nuevos te encuentran sin pagar anuncios.",
  },
  {
    icon: Smartphone,
    title: "App Android (opcional)",
    desc: "Tu propia app en Google Play para clientes que prefieren comprar desde una app.",
  },
];

const faqs = [
  {
    q: "¿Necesito saber de tecnología?",
    a: "No. El panel admin es tan fácil como llenar un formulario. Te enseño en 15 minutos.",
  },
  {
    q: "¿Puedo manejar mis productos desde el celular?",
    a: "Sí. El panel admin funciona perfecto en celular. Agregas productos, editas stock, ves pedidos.",
  },
  {
    q: "¿Pierdo mi cuenta de WhatsApp?",
    a: "No. Es tu mismo WhatsApp. El botón solo abre la conversación con el mensaje listo.",
  },
  {
    q: "¿Cuánto tiempo toma tenerlo listo?",
    a: "5 a 7 días hábiles. Si me pasas tu lista de productos el primer día, puede ser en 3.",
  },
  {
    q: "¿Hay cuotas mensuales?",
    a: "No. Pagas una sola vez. Solo el dominio se renueva cada año (~S/ 30).",
  },
];

export default function VenderPage() {
  const waUrl = `https://wa.me/${WHATSAPP_NUMBER}?text=${encodeURIComponent("Hola, quiero el catálogo digital para mi negocio. ¿Empezamos?")}`;

  return (
    <div className="min-h-screen bg-surface">
      <Navbar />

      <main className="pt-20">
        {/* Hero */}
        <section className="relative overflow-hidden">
          <div className="absolute inset-0 bg-gradient-to-br from-primary/5 via-transparent to-primary-container/10 pointer-events-none" />
          <div className="max-w-container-max mx-auto px-4 lg:px-12 py-14 sm:py-20">
            <div className="max-w-3xl mx-auto text-center">
              <span className="bg-primary-fixed text-on-primary-fixed px-4 py-1 rounded-full text-label-caps font-label-caps inline-block mb-6">
                Para emprendedores en Perú
              </span>
              <h1 className="text-4xl sm:text-5xl lg:text-6xl font-extrabold text-on-surface leading-tight mb-6">
                Tu negocio sin catálogo digital
                <span className="text-primary"> está perdiendo ventas</span>
              </h1>
              <p className="text-body-lg sm:text-xl text-on-surface-variant mb-8 max-w-2xl mx-auto leading-relaxed">
                Hoy tus clientes te escriben "¿cuánto cuesta?" y "¿hay stock?"
                — con tu catálogo digital ven precios, fotos y pagan solos.
                Sin app, sin comisiones, sin enredo.
              </p>
              <div className="flex flex-col sm:flex-row gap-4 justify-center">
                <Link
                  href={waUrl}
                  target="_blank"
                  className="bg-primary text-on-primary px-8 py-5 rounded-bento-sm font-bold text-body-md hover:bg-primary-container hover:text-on-primary-container transition-all active:scale-[0.98] inline-flex items-center justify-center gap-3 text-lg"
                >
                  <MessageCircle className="h-6 w-6" />
                  Lo quiero — S/ 650
                </Link>
                <Link
                  href="/catalogo"
                  className="border-2 border-outline-variant text-on-surface-variant px-8 py-5 rounded-bento-sm font-bold text-body-md hover:bg-surface-container-higher transition-all inline-flex items-center justify-center gap-3 text-lg"
                >
                  Ver demo gratis
                  <ChevronRight className="h-5 w-5" />
                </Link>
              </div>
              <p className="text-sm text-on-surface-variant/60 mt-4">
                ✅ Incluye dominio .pe el primer año · Sin cuotas mensuales
              </p>
            </div>
          </div>
        </section>

        {/* Social Proof — Contador simple */}
        <section className="max-w-container-max mx-auto px-4 lg:px-12 pb-14 sm:pb-20">
          <div className="grid grid-cols-3 gap-4 sm:gap-8 max-w-2xl mx-auto text-center">
            <div className="p-4">
              <div className="text-3xl sm:text-4xl font-extrabold text-primary">1</div>
              <div className="text-sm sm:text-body-md text-on-surface-variant mt-1">negocio con catálogo</div>
            </div>
            <div className="p-4">
              <div className="text-3xl sm:text-4xl font-extrabold text-primary">12</div>
              <div className="text-sm sm:text-body-md text-on-surface-variant mt-1">productos publicados</div>
            </div>
            <div className="p-4">
              <div className="text-3xl sm:text-4xl font-extrabold text-primary">100%</div>
              <div className="text-sm sm:text-body-md text-on-surface-variant mt-1">satisfacción</div>
            </div>
          </div>
        </section>

        {/* Problema */}
        <section className="bg-surface-container-highest py-14 sm:py-20">
          <div className="max-w-container-max mx-auto px-4 lg:px-12">
            <div className="max-w-3xl mx-auto">
              <span className="text-label-caps font-label-caps text-primary mb-4 block">¿TE IDENTIFICAS?</span>
              <h2 className="text-3xl sm:text-4xl font-bold text-on-surface mb-8">
                Esto te pasa si no tienes catálogo digital
              </h2>
              <div className="space-y-4 text-body-lg text-on-surface-variant">
                <div className="bento-tile p-6 flex items-start gap-4">
                  <div className="bg-error-container text-error rounded-full p-2 shrink-0 mt-1">
                    <X className="h-4 w-4" />
                  </div>
                  <div>
                    <strong className="text-on-surface">Clientes te preguntan precio uno por uno</strong>
                    <p>Respondes 50 veces al día "cuánto cuesta" y al final no compran.</p>
                  </div>
                </div>
                <div className="bento-tile p-6 flex items-start gap-4">
                  <div className="bg-error-container text-error rounded-full p-2 shrink-0 mt-1">
                    <X className="h-4 w-4" />
                  </div>
                  <div>
                    <strong className="text-on-surface">No saben si hay stock</strong>
                    <p>Preguntan, dices que sí, pero ya se vendió. Cliente frustrado.</p>
                  </div>
                </div>
                <div className="bento-tile p-6 flex items-start gap-4">
                  <div className="bg-error-container text-error rounded-full p-2 shrink-0 mt-1">
                    <X className="h-4 w-4" />
                  </div>
                  <div>
                    <strong className="text-on-surface">Tus fotos se pierden en WhatsApp</strong>
                    <p>Envías catálogo por fotos, el cliente no encuentra lo que vio ayer.</p>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </section>

        {/* Solución — Capturas reales */}
        <section className="py-14 sm:py-20">
          <div className="max-w-container-max mx-auto px-4 lg:px-12">
            <div className="text-center mb-12">
              <span className="text-label-caps font-label-caps text-primary mb-4 block">LA SOLUCIÓN</span>
              <h2 className="text-3xl sm:text-4xl font-bold text-on-surface mb-4">
                Así funciona tu catálogo digital
              </h2>
              <p className="text-body-lg text-on-surface-variant max-w-2xl mx-auto">
                Tus clientes entran, ven productos, consultan por WhatsApp y pagan con Yape. Todo desde el link que compartes.
              </p>
            </div>

            <div className="grid md:grid-cols-2 gap-6 mb-8">
              <div className="bento-tile p-6 sm:p-8">
                <div className="flex items-center gap-3 mb-4">
                  <div className="bg-primary-fixed text-primary rounded-full p-2">
                    <Smartphone className="h-5 w-5" />
                  </div>
                  <h3 className="text-headline-sm font-bold text-on-surface">Vista del cliente</h3>
                </div>
                <ul className="space-y-3">
                  {[
                    "Ve todos los productos con fotos y precios",
                    "Filtra por categoría y busca por nombre",
                    "Toca un producto y ve detalles, stock y descripción",
                    "Abre WhatsApp directo con el producto listo",
                    "Paga con Yape sin salir del catálogo",
                  ].map((item, i) => (
                    <li key={i} className="flex items-start gap-3 text-body-md text-on-surface-variant">
                      <CheckCircle className="h-5 w-5 text-green-600 shrink-0 mt-0.5" />
                      {item}
                    </li>
                  ))}
                </ul>
                <Link
                  href="/catalogo"
                  className="btn-bento mt-6 inline-flex items-center justify-center gap-2"
                >
                  Ver catálogo demo
                  <ChevronRight className="h-4 w-4" />
                </Link>
              </div>

              <div className="bento-tile p-6 sm:p-8">
                <div className="flex items-center gap-3 mb-4">
                  <div className="bg-primary-fixed text-primary rounded-full p-2">
                    <BarChart3 className="h-5 w-5" />
                  </div>
                  <h3 className="text-headline-sm font-bold text-on-surface">Panel administrador</h3>
                </div>
                <ul className="space-y-3">
                  {[
                    "Agrega productos con foto, precio, SKU y stock",
                    "Edita o elimina en 2 clics",
                    "Sube fotos desde tu celular (abre la cámara)",
                    "Escanea códigos de barras para buscar y actualizar stock",
                    "Ve reportes de contactos y pagos",
                  ].map((item, i) => (
                    <li key={i} className="flex items-start gap-3 text-body-md text-on-surface-variant">
                      <CheckCircle className="h-5 w-5 text-green-600 shrink-0 mt-0.5" />
                      {item}
                    </li>
                  ))}
                </ul>
                <Link
                  href="/login"
                  className="btn-bento-outline mt-6 inline-flex items-center justify-center gap-2"
                >
                  Ver panel demo
                  <ChevronRight className="h-4 w-4" />
                </Link>
              </div>
            </div>
          </div>
        </section>

        {/* Features Grid */}
        <section className="bg-surface-container-highest py-14 sm:py-20">
          <div className="max-w-container-max mx-auto px-4 lg:px-12">
            <div className="text-center mb-12">
              <h2 className="text-3xl sm:text-4xl font-bold text-on-surface mb-4">
                Todo lo que incluye
              </h2>
              <p className="text-body-lg text-on-surface-variant max-w-2xl mx-auto">
                Sin letras chicas. Todo esto funciona el día 1.
              </p>
            </div>
            <div className="grid sm:grid-cols-2 lg:grid-cols-4 gap-4 sm:gap-6">
              {features.map((feat) => (
                <div key={feat.title} className="bento-tile p-6 hover:border-primary/30 transition-colors">
                  <div className="bg-primary-fixed text-primary rounded-xl p-3 w-fit mb-4">
                    <feat.icon className="h-5 w-5" />
                  </div>
                  <h3 className="text-body-md font-bold text-on-surface mb-2">{feat.title}</h3>
                  <p className="text-body-md text-on-surface-variant text-sm leading-relaxed">{feat.desc}</p>
                </div>
              ))}
            </div>
          </div>
        </section>

        {/* App opcional */}
        <section className="py-14 sm:py-20">
          <div className="max-w-container-max mx-auto px-4 lg:px-12">
            <div className="bento-tile p-8 sm:p-12 bg-gradient-to-br from-primary to-primary-container text-on-primary max-w-4xl mx-auto">
              <div className="flex flex-col sm:flex-row items-start sm:items-center gap-6">
                <div className="bg-white/20 rounded-2xl p-4">
                  <Smartphone className="h-12 w-12" />
                </div>
                <div className="flex-1">
                  <h3 className="text-headline-sm font-bold mb-2">¿Quieres también app Android?</h3>
                  <p className="text-body-lg opacity-90">
                    Tu propia app publicada en Google Play. Tus clientes abren, ven productos y compran. Ideal si quieres llevar tu negocio al siguiente nivel.
                  </p>
                </div>
                <div className="shrink-0">
                  <div className="bg-white/20 rounded-bento-sm px-6 py-4 text-center">
                    <div className="text-2xl font-bold">S/ 1,200</div>
                    <div className="text-sm opacity-80">web + app</div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </section>

        {/* Precios */}
        <section className="bg-surface-container-highest py-14 sm:py-20">
          <div className="max-w-container-max mx-auto px-4 lg:px-12">
            <div className="text-center mb-12">
              <span className="text-label-caps font-label-caps text-primary mb-4 block">INVERSIÓN</span>
              <h2 className="text-3xl sm:text-4xl font-bold text-on-surface mb-4">Elige tu plan</h2>
            </div>
            <div className="grid md:grid-cols-2 gap-6 max-w-3xl mx-auto">
              <div className="bento-tile p-8 border-primary/50 bg-surface-container-lowest relative">
                <div className="bg-primary-fixed text-on-primary-fixed text-label-caps font-label-caps px-3 py-1 rounded-full inline-block mb-4">
                  MÁS POPULAR
                </div>
                <h3 className="text-headline-sm font-bold text-on-surface mb-2">Catálogo Web</h3>
                <p className="text-body-md text-on-surface-variant mb-6">Todo lo que necesitas para empezar a vender online.</p>
                <div className="mb-6">
                  <span className="text-5xl font-extrabold text-on-surface">S/ 650</span>
                  <span className="text-body-md text-on-surface-variant ml-2">único pago</span>
                </div>
                <ul className="space-y-3 mb-8">
                  {[
                    "Catálogo web con todos tus productos",
                    "Botón WhatsApp en cada producto",
                    "Pago con Yape integrado",
                    "Panel administrador completo",
                    "Escáner de código de barras",
                    "Subida de fotos desde el celular",
                    "Dominio .pe incluído (1er año)",
                    "Aparece en Google",
                    "Soporte vía WhatsApp",
                  ].map((item) => (
                    <li key={item} className="flex items-start gap-3 text-body-md text-on-surface-variant">
                      <CheckCircle className="h-5 w-5 text-green-600 shrink-0 mt-0.5" />
                      {item}
                    </li>
                  ))}
                </ul>
                <Link
                  href={waUrl}
                  target="_blank"
                  className="btn-bento flex items-center justify-center gap-3 py-5 text-lg"
                >
                  <MessageCircle className="h-5 w-5" />
                  Lo quiero — S/ 650
                </Link>
              </div>

              <div className="bento-tile p-8 bg-surface-container-lowest">
                <h3 className="text-headline-sm font-bold text-on-surface mb-2">Web + App Android</h3>
                <p className="text-body-md text-on-surface-variant mb-6">Catálogo web + tu propia app en Google Play.</p>
                <div className="mb-6">
                  <span className="text-5xl font-extrabold text-on-surface">S/ 1,200</span>
                  <span className="text-body-md text-on-surface-variant ml-2">único pago</span>
                </div>
                <ul className="space-y-3 mb-8">
                  {[
                    "Todo lo del plan Web",
                    "App Android publicada en Google Play",
                    "App con tu logo y colores",
                    "Notificaciones de pedidos",
                    "Misma base de datos (web y app sincronizadas)",
                  ].map((item) => (
                    <li key={item} className="flex items-start gap-3 text-body-md text-on-surface-variant">
                      <CheckCircle className="h-5 w-5 text-green-600 shrink-0 mt-0.5" />
                      {item}
                    </li>
                  ))}
                </ul>
                <Link
                  href={`https://wa.me/${WHATSAPP_NUMBER}?text=${encodeURIComponent("Hola, quiero el plan Web + App Android. ¿Empezamos?")}`}
                  target="_blank"
                  className="btn-bento flex items-center justify-center gap-3 py-5 text-lg"
                >
                  <MessageCircle className="h-5 w-5" />
                  Lo quiero — S/ 1,200
                </Link>
              </div>
            </div>
          </div>
        </section>

        {/* FAQ */}
        <section className="py-14 sm:py-20">
          <div className="max-w-container-max mx-auto px-4 lg:px-12">
            <div className="text-center mb-12">
              <h2 className="text-3xl sm:text-4xl font-bold text-on-surface mb-4">Preguntas frecuentes</h2>
            </div>
            <div className="max-w-2xl mx-auto space-y-4">
              {faqs.map((faq) => (
                <details key={faq.q} className="bento-tile p-6 group cursor-pointer">
                  <summary className="text-body-md font-bold text-on-surface list-none flex items-center justify-between gap-4">
                    {faq.q}
                    <ChevronRight className="h-5 w-5 text-on-surface-variant shrink-0 group-open:rotate-90 transition-transform" />
                  </summary>
                  <p className="mt-4 text-body-md text-on-surface-variant">{faq.a}</p>
                </details>
              ))}
            </div>
          </div>
        </section>

        {/* CTA Final */}
        <section className="py-14 sm:py-20 bg-primary">
          <div className="max-w-container-max mx-auto px-4 lg:px-12 text-center">
            <h2 className="text-3xl sm:text-4xl font-bold text-on-primary mb-4">
              ¿Listo para tener tu catálogo digital?
            </h2>
            <p className="text-body-lg text-on-primary/80 mb-8 max-w-xl mx-auto">
              Responde en 5 minutos y empezamos. En 7 días tu negocio ya está vendiendo online.
            </p>
            <Link
              href={waUrl}
              target="_blank"
              className="bg-white text-primary px-10 py-6 rounded-bento-sm font-bold text-body-md hover:bg-surface-container-highest transition-all inline-flex items-center gap-3 text-lg"
            >
              <MessageCircle className="h-6 w-6" />
              Empezar ahora — S/ 650
            </Link>
          </div>
        </section>
      </main>

      <Footer />
    </div>
  );
}
