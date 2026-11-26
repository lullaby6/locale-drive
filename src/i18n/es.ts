import type { Translations } from "@/i18n/en";

const es: Translations = {
	languageName: "Español",

	meta: {
		title: "Locale Drive · Tu propio Google Drive en tu red local",
		description:
			"Comparte y transfiere archivos entre todos los dispositivos de tu Wi-Fi desde el navegador. Sin cuentas, sin nube, sin instalar nada en los demás dispositivos. Gratis y de código abierto.",
	},

	nav: {
		features: "Funciones",
		howItWorks: "Cómo funciona",
		screenshots: "Capturas",
		download: "Descargar",
		faq: "Preguntas",
		github: "Ver en GitHub",
		npm: "Ver en npm",
		language: "Idioma",
		menu: "Menú",
		theme: { device: "Tema del dispositivo", light: "Tema claro", dark: "Tema oscuro" },
	},

	hero: {
		badge: "Gratis y de código abierto · MIT",
		title: "Un Google Drive para tu red local",
		subtitle:
			"Comparte una carpeta de tu computadora y ábrela desde cualquier celular, tablet o laptop de la misma Wi-Fi. Explora, sube, descarga y organiza archivos desde el navegador: sin cuentas, sin nube y sin instalar nada en los demás dispositivos.",
		download: "Descargar para Windows",
		npm: "Instalar con npm",
		note: (version: string) => `Versión ${version} · App para Windows 10/11, o cualquier sistema con Node.js`,
		pills: ["Sin cuentas", "Sin nube", "Funciona sin internet", "Solo un navegador en los demás dispositivos"],
	},

	concept: {
		title: "Una computadora comparte, todos los dispositivos la abren",
		subtitle:
			"Locale Drive no es una app para enviar archivos de un dispositivo a otro. Tu computadora se convierte en un pequeño servidor de archivos para una carpeta, y cualquier dispositivo de la red la abre como una página web.",
		host: {
			title: "Tu computadora",
			body: "Ejecuta Locale Drive y comparte una carpeta. Los archivos quedan en su disco.",
		},
		network: {
			title: "La misma Wi-Fi / LAN",
			body: "Todo viaja por tu red local, a toda su velocidad.",
		},
		devices: {
			title: "Cualquier dispositivo",
			body: "Celulares, tablets, laptops, TVs... solo necesitan un navegador.",
		},
	},

	how: {
		title: "Cómo funciona",
		subtitle: "Tres pasos, sin configurar nada.",
		steps: [
			{
				title: "Inicia Locale Drive",
				body: "Abre la app de escritorio, o ejecuta npx locale-drive en una terminal. Se abre la carpeta compartida en tu navegador.",
			},
			{
				title: "Escanea el código QR",
				body: "Haz clic en Conectar otro dispositivo y escanea el código con tu celular, o escribe la dirección que muestra.",
			},
			{
				title: "Comparte archivos",
				body: "Sube, descarga, previsualiza, mueve y organiza archivos desde cualquier dispositivo. Los cambios aparecen en todos al instante.",
			},
		],
	},

	screenshots: {
		title: "Échale un vistazo",
		subtitle: "La misma app en todos los dispositivos, en tema claro u oscuro. Haz clic en una captura para agrandarla.",
		tabs: {
			list: "Lista",
			grid: "Cuadrícula",
			preview: "Vista previa",
			connect: "Conectar",
			mobile: "Celular",
		},
		captions: {
			list: "Vista de lista con tamaños y fechas, acciones en lote y un resumen del almacenamiento.",
			grid: "Cuadrícula al estilo Google Drive con miniaturas de imágenes y videos.",
			preview: "Vistas previas a pantalla completa de imágenes, video, audio, PDFs y texto. Usa ← → para pasar de un archivo a otro.",
			connect: "Conecta otro dispositivo escaneando un código QR.",
			mobile: "En celulares se adapta con vista de cuadrícula y una barra de acciones abajo.",
		},
		enlarge: "Agrandar captura",
		close: "Cerrar",
		previous: "Captura anterior",
		next: "Captura siguiente",
	},

	features: {
		title: "Funciones",
		subtitle: "Todo lo que esperas de un explorador de archivos, en el navegador de cada dispositivo.",
		items: [
			{ icon: "tabler:folders", title: "Carpetas y ruta de navegación", body: "Crea carpetas, recórrelas con la ruta de navegación y vuelve atrás con el botón del navegador." },
			{ icon: "tabler:drag-drop", title: "Arrastrar y soltar", body: "Suelta archivos en cualquier parte para subirlos, o sobre una carpeta. Arrastra elementos a carpetas para moverlos." },
			{ icon: "tabler:select-all", title: "Selección como en tu explorador", body: "Selección con recuadro, rangos con Shift+clic, casillas, y Ctrl/Cmd para sumar a la selección." },
			{ icon: "tabler:keyboard", title: "Atajos de teclado", body: "Ctrl+A, flechas, Enter, Retroceso, Supr, F2 y más. Presiona ? en la app para verlos todos." },
			{ icon: "tabler:layout-grid", title: "Vista de lista y cuadrícula", body: "Filas con detalles, o una cuadrícula con miniaturas. Se recuerda tu elección." },
			{ icon: "tabler:eye", title: "Vistas previas", body: "Imágenes, video, audio, PDFs y archivos de texto o código se abren en un visor a pantalla completa." },
			{ icon: "tabler:file-zip", title: "Descargas en lote", body: "Descarga varios archivos o carpetas enteras en un solo .zip, o elimínalos juntos." },
			{ icon: "tabler:upload", title: "Progreso de subida", body: "Velocidad, tiempo restante y un botón para cancelar cada subida." },
			{ icon: "tabler:refresh-dot", title: "Actualización en vivo", body: "Los cambios desde cualquier dispositivo, o hechos directamente en la carpeta, aparecen en todos sin recargar." },
			{ icon: "tabler:clipboard-text", title: "Portapapeles compartido", body: "Pega un texto o un enlace en un dispositivo y cópialo en otro." },
			{ icon: "tabler:qrcode", title: "Conexión con código QR", body: "Se muestra en la terminal y en la app, para que los celulares se conecten en segundos." },
			{ icon: "tabler:wifi-off", title: "Funciona sin internet", body: "Todo, íconos incluidos, lo sirve tu computadora. Ideal para una red local sin conexión." },
			{ icon: "tabler:player-play", title: "Descargas reanudables", body: "Las peticiones por rangos permiten reanudar descargas y adelantar videos." },
			{ icon: "tabler:database", title: "Información del almacenamiento", body: "Cantidad de archivos y carpetas, espacio usado y espacio libre en el disco." },
			{ icon: "tabler:language", title: "Inglés y español", body: "Se elige según el idioma del dispositivo, y se puede cambiar desde el encabezado." },
			{ icon: "tabler:moon", title: "Tema claro, oscuro y del dispositivo", body: "Sigue a tu sistema o el tema que elijas." },
		],
	},

	download: {
		title: "Descargar",
		subtitle: "Elige la app de escritorio para Windows, o ejecútalo en cualquier sistema con Node.js.",
		recommended: "Recomendado",
		installer: {
			title: "Instalador",
			body: "Instala Locale Drive y lo agrega al menú Inicio. Funciona desde el área de notificaciones, junto al reloj.",
			button: "Descargar instalador",
		},
		portable: {
			title: "Portable",
			body: "Sin instalación: descomprímelo donde quieras, incluso en un pendrive, y abre Locale Drive.exe.",
			button: "Descargar portable",
		},
		npm: {
			title: "npm",
			body: "Para Windows, macOS y Linux. Necesita Node.js y se usa desde la terminal.",
			button: "Ver instrucciones de npm",
		},
		allReleases: "Todas las versiones y novedades",
		desktopNotes: {
			title: "Sobre la app de escritorio",
			items: [
				"Requiere Windows 10 u 11. Incluye Node.js, no hace falta instalarlo.",
				"La primera vez que se abre, el Firewall de Windows pregunta si node puede usar la red: permítelo en redes privadas, o los demás dispositivos no podrán conectarse.",
				"Los archivos se guardan en Documentos\\Locale Drive.",
				"Haz clic en el ícono de la bandeja para volver a abrir la página. Clic derecho → Salir detiene el servidor.",
			],
		},
	},

	npmGuide: {
		title: "Instalar con npm",
		subtitle: (node: string) => `Funciona en Windows, macOS y Linux. Requiere Node.js ${node} o superior.`,
		steps: [
			{ title: "Instálalo globalmente", body: "Agrega el comando locale-drive a tu terminal." },
			{ title: "Comparte una carpeta", body: "Muestra la dirección en la red local y un código QR, y abre la app en tu navegador." },
			{ title: "O ejecútalo sin instalar", body: "npx descarga y ejecuta la última versión." },
		],
		defaultFolder: "Si no indicas una ruta, Locale Drive usa ./storage en la carpeta actual y la crea si hace falta.",
		terminalTitle: "Terminal",
		optionsTitle: "Opciones",
		columns: { option: "Opción", alias: "Alias", default: "Por defecto", description: "Descripción" },
		options: [
			{ option: "--port", alias: "-p", default: "24680", description: "Puerto en el que escucha el servidor." },
			{ option: "--max-upload", alias: "-m", default: "0", description: "Tamaño máximo por archivo subido, en MB. 0 significa sin límite." },
			{ option: "--no-open", alias: "", default: "", description: "No abrir el navegador al iniciar." },
			{ option: "--help", alias: "", default: "", description: "Mostrar todas las opciones." },
		],
		examplesTitle: "Ejemplos",
		examples: [
			{ comment: "Compartir ~/Videos en el puerto 8080", command: "locale-drive ~/Videos --port 8080" },
			{ comment: "Limitar las subidas a 500 MB por archivo y no abrir el navegador", command: "locale-drive ./shared -m 500 --no-open" },
		],
		portsTitle: "Puertos",
		ports:
			"Por defecto usa el puerto 24680. Si está ocupado, usa el siguiente libre, y la terminal, el código QR y la app siempre muestran el puerto en uso. Si indicas --port y está ocupado, Locale Drive se detiene con un mensaje.",
		copy: "Copiar",
		copied: "Copiado",
	},

	security: {
		title: "Solo en redes de confianza",
		body: "Cualquiera en tu red que abra la dirección puede leer, subir, mover y eliminar archivos de la carpeta compartida. Usa Locale Drive en casa, en la oficina o en tu propio hotspot, no en una Wi-Fi pública.",
	},

	faq: {
		title: "Preguntas frecuentes",
		items: [
			{
				q: "¿Es gratis?",
				a: "Sí. Locale Drive es gratis y de código abierto bajo la licencia MIT. Sin publicidad, sin rastreo y sin cuentas.",
			},
			{
				q: "¿Los demás dispositivos tienen que instalar algo?",
				a: "No. Solo la computadora que comparte la carpeta ejecuta Locale Drive. Celulares, tablets y otras computadoras solo abren la dirección en un navegador.",
			},
			{
				q: "¿Funciona por internet?",
				a: "No, y es a propósito. Funciona entre dispositivos conectados a la misma Wi-Fi o red local, y sigue funcionando aunque esa red no tenga internet.",
			},
			{
				q: "¿Dónde se guardan mis archivos?",
				a: "En la carpeta que compartes, en la computadora que ejecuta Locale Drive. La app de escritorio usa Documentos\\Locale Drive; con npm eliges la carpeta. Nada se sube a ninguna nube.",
			},
			{
				q: "¿En qué se diferencia de las apps para enviar archivos?",
				a: "Las apps para enviar archivos los mandan de un dispositivo a otro, y todos necesitan la app. Locale Drive comparte una carpeta que todos los dispositivos pueden explorar a la vez desde un navegador, como un pequeño Google Drive en tu red local.",
			},
			{
				q: "Los demás dispositivos no se pueden conectar. ¿Qué reviso?",
				a: "Que estén en la misma red, que el Firewall de Windows permita node en redes privadas, y que uses la dirección o el código QR que muestra la app (el puerto puede cambiar si el 24680 está ocupado).",
			},
			{
				q: "¿Hay un límite de tamaño para los archivos?",
				a: "Por defecto no hay límite. Con npm puedes poner uno por archivo con --max-upload (en MB).",
			},
		],
	},

	footer: {
		tagline: "Comparte y transfiere archivos en tu red local, desde cualquier navegador.",
		product: "Producto",
		project: "Proyecto",
		license: "Licencia MIT",
		issues: "Reportar un error",
		desktopRepo: "Repositorio de la app de escritorio",
		madeBy: "Hecho por",
	},

	copy: "Copiar",
	copied: "Copiado",
};

export default es;
