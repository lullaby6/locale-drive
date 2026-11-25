import { formatBytes } from "@/utils/format";

import type { Translations } from "@/languages/en";

const plural = (count: number, one: string, many: string) => `${count} ${count === 1 ? one : many}`;

const es: Translations = {
	languageName: "Español",

	common: {
		cancel: "Cancelar",
		close: "Cerrar",
		download: "Descargar",
		downloadZip: "Descargar .zip",
		downloadAsZip: "Descargar como .zip",
		rename: "Renombrar",
		duplicate: "Duplicar",
		delete: "Eliminar",
		open: "Abrir",
		preview: "Vista previa",
		openInNewTab: "Abrir en otra pestaña",
		storage: "Almacenamiento",
		files: (count: number) => plural(count, "archivo", "archivos"),
		folders: (count: number) => plural(count, "carpeta", "carpetas"),
		items: (count: number) => plural(count, "elemento", "elementos"),
	},

	header: {
		openTooltip: "Abrir esta carpeta en la computadora",
		connect: "Conectar otro dispositivo",
		clipboard: "Portapapeles compartido",
		github: "Ver en GitHub",
		language: "Idioma",
		theme: { device: "Tema del dispositivo", light: "Tema claro", dark: "Tema oscuro" },
	},

	stats: {
		inStorage: (size: string) => `${size} almacenados`,
		disk: "Disco",
		diskFree: (free: string, total: string) => `${free} libres de ${total}`,
		diskUsed: (percent: number) => `${percent}% del disco en uso`,
	},

	toolbar: {
		searchPlaceholder: "Buscar en esta carpeta y subcarpetas...",
		clearSearch: "Borrar búsqueda",
		listLayout: "Vista de filas",
		gridLayout: "Vista de cuadrícula",
		sortBy: "Ordenar por",
		reload: "Recargar",
		newFolder: "Nueva carpeta",
		upload: "Subir",
		sort: {
			"modificationDate:desc": "Modificado (más reciente)",
			"modificationDate:asc": "Modificado (más antiguo)",
			"filename:asc": "Nombre (A → Z)",
			"filename:desc": "Nombre (Z → A)",
			"size:desc": "Tamaño (más grande)",
			"size:asc": "Tamaño (más chico)",
			"creationDate:desc": "Creado (más reciente)",
			"creationDate:asc": "Creado (más antiguo)",
		},
	},

	location: {
		clearSelection: "Quitar selección",
		selected: (count: number) => (count === 1 ? "1 seleccionado" : `${count} seleccionados`),
		selectAll: "Seleccionar todo",
		results: (count: string, query: string) => `${count} resultados para “${query}”`,
		goToLocation: "Ir a la ubicación",
	},

	columns: {
		name: "Nombre",
		size: "Tamaño",
		modified: "Última modificación",
		created: "Creado",
		actions: "Acciones",
	},

	entries: {
		select: (name: string) => `Seleccionar ${name}`,
		selectAll: "Seleccionar todo",
		moreActions: (name: string) => `Más acciones para ${name}`,
		foldersSection: (count: number) => `Carpetas (${count})`,
		filesSection: (count: number) => `Archivos (${count})`,
		dragItems: (count: number) => plural(count, "elemento", "elementos"),
	},

	empty: {
		noResults: "Sin resultados",
		noResultsHint: (query: string) => `Nada en esta carpeta ni en sus subcarpetas coincide con “${query}”.`,
		folder: "Esta carpeta está vacía",
		folderHint: "Arrastra y suelta archivos en cualquier parte de la página, o usa el botón Subir.",
	},

	drop: {
		title: "Suelta los archivos para subirlos",
		to: "a",
	},

	preview: {
		close: "Cerrar vista previa",
		previous: "Archivo anterior",
		next: "Archivo siguiente",
		position: (index: number, total: number) => `${index} de ${total}`,
		truncated: (shown: string, total: string) =>
			`Se muestran los primeros ${shown} de ${total}. Descarga el archivo para verlo completo.`,
		emptyFile: "(archivo vacío)",
		noPreview: "Vista previa no disponible",
		cantPlay: "Este archivo no se puede reproducir en el navegador",
		couldNotLoad: "No se pudo cargar el archivo",
	},

	upload: {
		uploading: (files: number, percent: number) => `Subiendo ${plural(files, "archivo", "archivos")} · ${percent}%`,
		finished: "Subidas terminadas",
		processing: "Procesando...",
		progress: (loaded: string, total: string, speed: string, eta: string) =>
			`${loaded} de ${total} · ${speed}/s${eta ? ` · ${eta}` : ""}`,
		secondsLeft: (seconds: number) => `faltan ${seconds} s`,
		minutesLeft: (minutes: number) => `faltan ${minutes} min`,
		hoursLeft: (hours: string) => `faltan ${hours} h`,
		done: (size: string) => `${size} · Listo`,
		failed: "Falló la subida",
		canceled: "Cancelada",
		cancel: "Cancelar subida",
		dismiss: "Descartar",
	},

	dialogs: {
		newFolderTitle: "Nueva carpeta",
		defaultFolderName: "Nueva carpeta",
		create: "Crear",
		renameTitle: "Renombrar",
		deleteTitle: "¿Eliminar definitivamente?",
		deleteBody: (label: string) => `${label} se eliminará de la computadora. Esto no se puede deshacer.`,
		deleteFoldersWarning: "Las carpetas se eliminan con todo su contenido.",
		duplicateTitle: "¿Duplicar?",
		duplicateBody: (name: string) => `Se creará una copia de “${name}” en la misma carpeta.`,
		duplicateFolderHint: "La carpeta se copia con todo su contenido.",
		validation: {
			empty: "El nombre no puede estar vacío",
			tooLong: "El nombre es demasiado largo",
			invalidChars: 'El nombre no puede contener < > : " / \\ | ? *',
			trailing: "El nombre no puede terminar en punto o espacio",
		},
	},

	shortcuts: {
		title: "Atajos de teclado",
		button: "Atajos de teclado",
		hint: "Los atajos funcionan mientras no estés escribiendo en un campo de texto.",
		then: "y luego",
		groups: { selection: "Selección", navigation: "Navegación", actions: "Acciones" },
		selectAll: "Seleccionar todo lo de esta carpeta",
		clearSelection: "Quitar la selección",
		move: "Moverse entre archivos y carpetas",
		extend: "Ampliar la selección",
		moveCursor: "Moverse sin cambiar la selección",
		toggle: "Seleccionar o deseleccionar el elemento actual",
		firstLast: "Ir al primer o último elemento",
		open: "Abrir carpeta o ver el archivo",
		parent: "Ir a la carpeta superior",
		search: "Buscar",
		delete: "Eliminar",
		rename: "Renombrar",
		duplicate: "Duplicar",
		download: "Descargar (.zip si son varios)",
		newFolder: "Nueva carpeta",
		upload: "Subir archivos",
		toggleView: "Cambiar entre filas y cuadrícula",
		help: "Mostrar esta lista",
	},

	notFound: {
		code: "404",
		pageTitle: "Página no encontrada",
		pageBody: "La página que buscas no existe o fue movida.",
		folderTitle: "Carpeta no encontrada",
		folderBody: (path: string) => `“${path}” ya no existe. Puede que se haya movido, renombrado o eliminado.`,
		back: "Ir al almacenamiento",
	},

	connection: {
		offlineTitle: "No se puede conectar con el servidor",
		offlineBody: "Comprueba que Locale Drive siga abierto en la computadora y que este dispositivo esté en la misma red.",
		retrying: "Reintentando automáticamente...",
		retryNow: "Reintentar ahora",
		lost: "Se perdió la conexión con el servidor. Intentando reconectar...",
		reconnected: "Conexión restablecida",
		networkError: "No se puede llegar al servidor. Revisa tu conexión.",
	},

	qr: {
		title: "Conectar otro dispositivo",
		hint: "Escanea este código con un celular o tablet conectado a la misma red Wi-Fi.",
		copyLink: "Copiar enlace",
		copied: "Enlace copiado",
		copyFailed: "No se pudo copiar el enlace",
	},

	clipboard: {
		title: "Portapapeles compartido",
		hint: "Pega un texto o enlace y presiona Compartir: aparece al instante en todos los dispositivos conectados.",
		placeholder: "Pega algo para compartir...",
		clear: "Vaciar",
		copy: "Copiar",
		share: "Compartir",
		unsaved: "Cambios sin compartir",
		sharedAt: (date: string) => `Compartido ${date}`,
		nothingShared: "Todavía no se compartió nada",
		pasteFromDevice: "Pegar desde este dispositivo",
		copiedToDevice: "Copiado al portapapeles de este dispositivo",
		copyFailed: "No se pudo copiar. Selecciona el texto y cópialo a mano",
		pasteDenied: "Se denegó el acceso al portapapeles",
	},

	toasts: {
		folderCreated: (name: string) => `Carpeta “${name}” creada`,
		renamed: "Renombrado correctamente",
		deleted: (count: number) => (count === 1 ? "Eliminado correctamente" : `${count} elementos eliminados`),
		moved: (count: number, folder: string) =>
			`${count === 1 ? "1 elemento movido" : `${count} elementos movidos`} a “${folder}”`,
		duplicated: (name: string) => `Duplicado como “${name}”`,
		uploaded: (count: number) => (count === 1 ? "Archivo subido correctamente" : `${count} archivos subidos correctamente`),
		preparingZip: "Preparando la descarga .zip...",
		tooLargeSkipped: (count: number, max: string) =>
			`${plural(count, "archivo omitido", "archivos omitidos")}: el tamaño máximo de subida es ${max}`,
		foldersSkipped: (count: number) =>
			`${plural(count, "carpeta omitida", "carpetas omitidas")}: suelta archivos, o crea la carpeta primero`,
		clipboardUpdated: "Portapapeles compartido actualizado",
		genericError: "Algo salió mal",
	},

	kinds: {
		folder: "Carpeta",
		image: "Imagen",
		video: "Video",
		audio: "Audio",
		pdf: "PDF",
		document: "Documento",
		spreadsheet: "Hoja de cálculo",
		presentation: "Presentación",
		archive: "Archivo comprimido",
		code: "Código",
		text: "Texto",
		font: "Fuente",
		executable: "Aplicación",
		android: "App de Android",
		disk: "Imagen de disco",
		file: "Archivo",
	},

	errors: {
		INVALID_PATH: () => "Ruta inválida",
		INVALID_REQUEST: () => "Solicitud inválida",
		NAME_EMPTY: () => "El nombre no puede estar vacío",
		NAME_TOO_LONG: (params: { max?: number }) => `El nombre no puede tener más de ${params.max ?? 255} caracteres`,
		NAME_INVALID_CHARS: () => 'El nombre no puede contener ninguno de estos caracteres: < > : " / \\ | ? *',
		NAME_RESERVED: (params: { name?: string }) => `“${params.name}” es un nombre reservado`,
		NAME_TRAILING: () => "El nombre no puede terminar en punto o espacio",
		NOT_FOUND: () => "No se encontró el archivo o la carpeta",
		NOT_A_FOLDER: () => "Esa ruta no es una carpeta",
		IS_A_FOLDER: () => "Esa acción no está disponible para carpetas",
		ALREADY_EXISTS: (params: { name?: string }) => `“${params.name}” ya existe en esta carpeta`,
		MOVE_INTO_ITSELF: (params: { name?: string }) => `No se puede mover “${params.name}” dentro de sí misma`,
		ROOT_PROTECTED: () => "La carpeta de almacenamiento no se puede modificar",
		NOTHING_SELECTED: () => "No hay nada seleccionado",
		FILE_TOO_LARGE: (params: { max?: number }) =>
			`El archivo es demasiado grande. El tamaño máximo de subida es ${formatBytes(params.max ?? 0)}`,
		CLIPBOARD_TOO_LONG: (params: { max?: number }) => `El texto es demasiado largo (máx. ${params.max ?? 0} caracteres)`,
	},
};

export default es;
