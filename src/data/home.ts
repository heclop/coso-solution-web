/**
 * Contenido de la home, sección por sección.
 * Texto editable aquí; los componentes de src/components/sections solo lo presentan.
 * Las imágenes se referencian por clave (ImageKey) y se resuelven en src/assets/images/index.ts.
 */
import type { TechIconKey } from './tech-icons';

export type ImageKey = 'frontend' | 'datos' | 'reunion' | 'equipo';

/* ───────── Hero ───────── */
export interface HeroContent {
  label: string;
  titleLead: string;
  titleAccent: string;
  lead: string;
  secondaryCta: { label: string; href: string };
  note: string;
  /** Imagen de portada a todo el ancho, con el texto encima (es el LCP de la página). */
  image: { key: ImageKey; alt: string; caption: string };
  /** Franja bajo la portada que presenta el diagrama antes/después. */
  practice: { eyebrow: string; title: string; text: string };
  diagram: {
    caption: string;
    before: { step: string; text: string; handoff?: string }[];
    after: string[];
    afterNote: string;
  };
}

export const hero: HeroContent = {
  label: 'Desarrollo de software y soluciones tecnológicas',
  titleLead: 'Primero entendemos el proceso.',
  titleAccent: 'Después escribimos el código.',
  lead: 'En Coso Solution desarrollamos aplicaciones web, conectamos sistemas y organizamos datos para ayudar a las empresas a trabajar mejor. También implementamos automatizaciones y soluciones de IA cuando tienen sentido para el problema que se necesita resolver.',
  secondaryCta: { label: 'Conoce nuestros servicios', href: '#servicios' },
  note: 'No necesitas llegar con la solución definida. Cuéntanos qué está pasando y evaluamos juntos cuál puede ser el mejor camino.',
  image: {
    key: 'frontend',
    alt: 'Página web abierta en un portátil, junto a su versión móvil y el código del componente',
    caption: 'Imagen ilustrativa',
  },
  practice: {
    eyebrow: 'En la práctica',
    title: 'Cuando los sistemas se conectan, hay menos trabajo que repetir.',
    text: 'Imagina que un pedido llega por correo, alguien lo copia a una hoja de cálculo y después vuelve a registrarlo en el sistema de facturación. Si esas herramientas pueden conectarse, parte de ese trabajo puede hacerse automáticamente y el equipo puede dedicar más tiempo a revisar lo importante.',
  },
  diagram: {
    caption: 'Un pedido, dos versiones',
    before: [
      { step: '01', text: 'Llega un pedido por correo' },
      { step: '02', text: 'Alguien copia los datos a una hoja de cálculo' },
      { step: '03', text: 'Los registra en facturación' },
      { step: '04', text: 'Revisa que todo coincida' },
    ],
    after: ['Formulario o pedido', 'Integración', 'Sistema de gestión o facturación'],
    afterNote:
      'La información se registra una vez y se comparte entre los sistemas que corresponda. Las excepciones siguen necesitando revisión.',
  },
};

/* ───────── Situaciones ───────── */
export interface Situation {
  quote: string;
  text: string;
  link: { label: string; href: string };
}

export const situationsIntro = {
  title: '¿Te suena alguna de estas situaciones?',
  text: 'Cada empresa trabaja de una manera distinta. Estas son algunas situaciones que podemos revisar contigo para encontrar una solución adecuada.',
};

export const situations: Situation[] = [
  {
    quote: 'Copiamos los mismos datos en varios sistemas.',
    text: 'Podemos evaluar integraciones y APIs para evitar registros duplicados, siempre que los sistemas lo permitan.',
    link: { label: 'Integración de sistemas', href: '#servicio-backend' },
  },
  {
    quote: 'Preparar un reporte nos toma demasiado tiempo.',
    text: 'Revisamos cómo se almacenan y consultan los datos para identificar oportunidades de mejora.',
    link: { label: 'Bases de datos', href: '#servicio-datos' },
  },
  {
    quote: 'La aplicación ya no se adapta a cómo trabajamos.',
    text: 'Podemos desarrollar nuevas herramientas o mejorar las que ya utilizas, según el estado del sistema y tus necesidades.',
    link: { label: 'Desarrollo web', href: '#servicio-frontend' },
  },
  {
    quote: 'Queremos usar IA, pero no sabemos por dónde empezar.',
    text: 'Analizamos el proceso y la información disponible para determinar si conviene utilizar IA, automatización tradicional o una combinación de ambas.',
    link: { label: 'IA aplicada', href: '#ia' },
  },
];

/* ───────── Servicios ───────── */
export interface Service {
  id: string;
  number: string;
  area: string;
  name: string;
  description: string;
  examples: string[];
  image?: { key: ImageKey; alt: string; caption: string };
  /** Aclaración que acompaña al servicio (límites, condiciones). Nunca una promesa de resultados. */
  note?: string;
  /** Enlace a una sección que amplía el servicio. */
  more?: { label: string; href: string };
}

export const servicesIntro = {
  title: 'Soluciones para las necesidades de tu negocio',
  text: 'Desde una página web hasta la integración de sistemas internos, cada proyecto parte de una necesidad concreta. Estas son las áreas en las que podemos ayudarte.',
  examplesTitle: 'Algunos trabajos habituales',
};

export const services: Service[] = [
  {
    id: 'servicio-backend',
    number: '01',
    area: 'Backend',
    name: 'APIs e integración de sistemas',
    description:
      'Desarrollamos servicios que conectan tus aplicaciones y permiten que la información circule entre ellas. También podemos integrar sistemas existentes, siempre que sus capacidades y accesos lo permitan.',
    examples: [
      'APIs para aplicaciones web, móviles o sistemas de terceros.',
      'Integraciones entre ERP, CRM y sistemas de facturación.',
      'Intercambio automático de información entre herramientas.',
    ],
  },
  {
    id: 'servicio-frontend',
    number: '02',
    area: 'Frontend',
    name: 'Desarrollo web y frontend',
    description:
      'Creamos páginas web, portales y aplicaciones para que tus clientes accedan a tus servicios y tu equipo gestione sus procesos de forma más sencilla.',
    examples: [
      'Páginas corporativas y landing pages.',
      'Paneles internos para pedidos, inventario u operaciones.',
      'Portales para clientes y proveedores.',
    ],
  },
  {
    id: 'servicio-datos',
    number: '03',
    area: 'Datos',
    name: 'Bases de datos y gestión de información',
    description:
      'Revisamos cómo se organiza, consulta y mantiene la información de tus sistemas. Buscamos problemas de estructura, rendimiento o consistencia y proponemos mejoras según el contexto.',
    examples: [
      'Análisis de consultas lentas e índices.',
      'Revisión y organización de modelos de datos.',
      'Migración de información entre sistemas.',
    ],
  },
  {
    id: 'servicio-consultoria',
    number: '04',
    area: 'Consultoría',
    name: 'Consultoría tecnológica',
    description:
      'Antes de construir algo nuevo, conviene entender el problema y evaluar las opciones. Te ayudamos a comparar alternativas, definir el alcance y decidir qué camino tiene sentido para tu negocio.',
    examples: [
      'Evaluar si conviene desarrollar o utilizar una herramienta existente.',
      'Definir el alcance y las prioridades de un proyecto.',
      'Planificar mejoras o la modernización de un sistema.',
    ],
  },
  {
    id: 'servicio-seo',
    number: '05',
    area: 'SEO',
    name: 'SEO técnico para sitios web',
    description:
      'Una web necesita una estructura clara, buen rendimiento y contenido útil para sus visitantes. Podemos trabajar en los aspectos técnicos que ayudan a los buscadores a rastrear y comprender el sitio.',
    examples: [
      'Revisión del rendimiento y de Core Web Vitals.',
      'Configuración de metadatos, sitemap y datos estructurados cuando correspondan.',
      'Revisión de encabezados, enlaces y estructura del contenido.',
    ],
    note: 'El SEO técnico ayuda a construir una buena base, pero no garantiza posiciones específicas en Google. El posicionamiento también depende del contenido, la competencia y otros factores.',
  },
  {
    id: 'servicio-automatizacion',
    number: '06',
    area: 'Automatización',
    name: 'Automatización de procesos',
    description:
      'Conectamos herramientas y configuramos flujos para reducir tareas manuales. Podemos utilizar n8n para coordinar pasos entre aplicaciones, enviar avisos o registrar información según las reglas acordadas.',
    examples: [
      'Enviar datos de un formulario a un CRM.',
      'Notificar al equipo cuando ocurre un evento.',
      'Preparar y enviar reportes de forma programada.',
    ],
    more: { label: 'Ver un ejemplo de automatización', href: '#automatizacion' },
  },
];

/* ───────── Tecnologías ───────── */
export interface TechItem {
  name: string;
  /** Clave del logotipo en src/data/tech-icons.ts; sin clave se muestra un ícono genérico. */
  icon?: TechIconKey;
}

export interface TechGroup {
  label: string;
  items: TechItem[];
}

export const techStack = {
  eyebrow: 'Herramientas de trabajo',
  title: 'Elegimos la tecnología según el proyecto.',
  text: 'No todos los problemas necesitan las mismas herramientas. La elección depende de lo que haya que construir, los sistemas que ya utilizas y las necesidades de mantenimiento.',
  groups: [
    {
      label: 'Backend',
      items: [
        { name: 'Node.js', icon: 'nodejs' },
        { name: 'NestJS', icon: 'nestjs' },
        { name: 'Python', icon: 'python' },
        { name: '.NET', icon: 'dotnet' },
      ],
    },
    {
      label: 'Frontend y aplicaciones',
      items: [
        { name: 'Astro', icon: 'astro' },
        { name: 'Angular', icon: 'angular' },
        { name: 'React', icon: 'react' },
        { name: 'Next.js', icon: 'nextjs' },
        { name: 'Flutter', icon: 'flutter' },
      ],
    },
    {
      label: 'Bases de datos',
      items: [
        { name: 'SQL Server', icon: 'sqlserver' },
        { name: 'PostgreSQL', icon: 'postgresql' },
        { name: 'Amazon Aurora' },
      ],
    },
    { label: 'Nube', items: [{ name: 'AWS', icon: 'aws' }] },
    { label: 'Automatización', items: [{ name: 'n8n', icon: 'n8n' }] },
  ] satisfies TechGroup[],
};

/* ───────── Detalle de datos ───────── */
export const dataDetail = {
  title: 'Antes de cambiar el servidor, revisemos la consulta.',
  text: 'Cuando un reporte tarda demasiado, el problema no siempre está en la capacidad del servidor. A veces, una consulta busca más información de la necesaria o no aprovecha los índices disponibles. Medir primero ayuda a decidir qué conviene cambiar.',
  codeNote:
    'El índice adecuado depende de la estructura de la tabla, las consultas reales y el motor de base de datos.',
  imageAlt: 'Persona revisando una tabla de cifras en un portátil junto a reportes impresos',
};

/* ───────── IA aplicada ───────── */
export interface TraceStep {
  label: string;
  text: string;
  detail?: string;
  review?: boolean;
}

export const ai = {
  eyebrow: 'IA aplicada',
  titleLead: 'Usemos IA cuando resuelva',
  titleRest: 'un problema concreto.',
  paragraphs: [
    'La inteligencia artificial puede ayudar a interpretar información, preparar respuestas o apoyar tareas repetitivas. Antes de proponer un agente, revisamos qué tarea debe realizar, con qué datos trabajará y qué controles necesita.',
    'No todos los procesos necesitan IA. En algunos casos, una automatización basada en reglas es más sencilla de mantener y ofrece un comportamiento más predecible.',
  ],
  checklistTitle: 'Antes de proponer una solución, revisamos:',
  checklist: [
    '¿La tarea se repite con suficiente frecuencia?',
    '¿Hay información fiable y autorizada para utilizar?',
    '¿Qué decisiones puede tomar el sistema y cuáles requieren aprobación?',
    '¿Cómo se detectan y corrigen los errores?',
  ],
  traceCaption: 'Consulta sobre un pedido',
  trace: [
    { label: 'pregunta', text: '«¿Cuándo llega mi pedido 4471?»' },
    {
      label: 'consulta',
      text: 'El sistema consulta el estado del pedido con acceso autorizado.',
    },
    {
      label: 'dato',
      text: 'El pedido figura como despachado y tiene una fecha estimada de entrega.',
    },
    {
      label: 'respuesta',
      text: 'El agente prepara una respuesta a partir de los datos disponibles.',
    },
    {
      label: 'control',
      text: 'Según el caso, la respuesta puede requerir revisión antes de enviarse.',
      review: true,
    },
  ] as TraceStep[],
  traceNote:
    'Este ejemplo es ilustrativo. No representa una integración ya implementada ni un resultado de un cliente.',
};

/* ───────── Automatización con n8n (dentro de la sección de IA) ───────── */
export const automation = {
  eyebrow: 'Automatización',
  title: 'Si las reglas están claras, podemos empezar con un flujo automático.',
  paragraphs: [
    'No todas las tareas necesitan un agente de IA. Cuando los pasos y las condiciones están definidos, un flujo de automatización puede ser más fácil de controlar y mantener. Con herramientas como n8n, es posible conectar aplicaciones y coordinar tareas en un mismo proceso.',
    'La instalación y el alojamiento dependen de los requisitos del proyecto y de la infraestructura elegida.',
  ],
  flowCaption: 'Nuevo contacto web',
  trigger: { label: 'Entrada', text: 'Una persona envía un formulario.' },
  step: { label: 'Validación', text: 'El flujo revisa los datos recibidos.' },
  outputs: [
    {
      label: 'Registro',
      text: 'Crea o actualiza el contacto en el CRM, si existe una integración disponible.',
    },
    { label: 'Notificación', text: 'Avisa al responsable.' },
    { label: 'Confirmación', text: 'Envía un mensaje al contacto, si se ha configurado ese paso.' },
  ],
  flowNote:
    'Las aplicaciones, canales y acciones concretas se definen según las herramientas disponibles y los permisos autorizados.',
};

/* ───────── Proceso ───────── */
export interface ProcessStep {
  title: string;
  text: string;
}

export const process = {
  title: 'Del primer planteamiento a una solución concreta.',
  intro:
    'Cada proyecto tiene su alcance y sus particularidades. Este es el recorrido que proponemos para entender la necesidad, acordar prioridades y avanzar con claridad.',
  imageAlt: 'Reunión de trabajo: una persona explica una propuesta sobre documentos impresos',
  steps: [
    {
      title: 'Primera conversación',
      text: 'Nos cuentas cómo trabajas hoy, qué dificultad quieres resolver y qué te gustaría mejorar.',
    },
    {
      title: 'Análisis y alcance',
      text: 'Revisamos los procesos, las herramientas existentes y las restricciones relevantes para definir qué conviene abordar.',
    },
    {
      title: 'Propuesta',
      text: 'Te presentamos una opción de trabajo con el alcance y las prioridades acordadas. Cuando hay alternativas, explicamos sus diferencias para que puedas decidir con información.',
    },
    {
      title: 'Desarrollo o implementación',
      text: 'Construimos la solución por etapas cuando el proyecto lo permite, para revisar avances y validar que respondan a lo acordado.',
    },
    {
      title: 'Entrega y siguientes pasos',
      text: 'Validamos lo realizado y acordamos la puesta en marcha, el soporte o el mantenimiento que corresponda al proyecto.',
    },
  ] satisfies ProcessStep[],
};

/* ───────── Enfoque ───────── */
export const approach = {
  title: 'Que las piezas encajen importa tanto como cada pieza.',
  eyebrow: 'Cómo pensamos las soluciones',
  intro:
    'Una aplicación puede necesitar una interfaz, una API, una base de datos y conexiones con otros sistemas. Por eso, antes de elegir herramientas, revisamos cómo debe funcionar el conjunto y qué necesita cada parte.',
  principles: [
    {
      title: 'Entender antes de recomendar',
      text: 'Primero revisamos la necesidad y el contexto; después evaluamos las opciones.',
    },
    {
      title: 'Pensar en el sistema completo',
      text: 'Consideramos las interfaces, la lógica, los datos y las integraciones para que la solución funcione como un conjunto.',
    },
    {
      title: 'Elegir según el contexto',
      text: 'Tenemos en cuenta los sistemas existentes, el alcance, el presupuesto y las necesidades de mantenimiento.',
    },
    {
      title: 'Explicar las alternativas con claridad',
      text: 'Queremos que entiendas qué implica cada opción y por qué podría convenirte.',
    },
  ],
};

/* ───────── Preguntas frecuentes ───────── */
export interface FaqItem {
  question: string;
  answer: string;
}

export const faqIntro = {
  title: 'Preguntas frecuentes',
  text: 'Estas respuestas cubren algunas dudas habituales. Si tu caso es distinto, puedes',
  linkLabel: 'contárnoslo directamente',
};

export const faq: FaqItem[] = [
  {
    question: '¿Qué tipo de proyectos realizan?',
    answer:
      'Trabajamos en desarrollo web, aplicaciones, APIs e integraciones, bases de datos, automatización, soluciones de IA y consultoría tecnológica. También podemos evaluar mejoras sobre sistemas existentes.',
  },
  {
    question: '¿Pueden trabajar con los sistemas que ya usamos?',
    answer:
      'En muchos casos, sí. Primero revisamos qué opciones de integración ofrece cada sistema, cómo se puede acceder a la información y qué restricciones existen.',
  },
  {
    question: '¿Cómo comienza un proyecto?',
    answer:
      'Comenzamos con una conversación para entender qué necesitas y cómo trabajas actualmente. Con esa información evaluamos el alcance y los siguientes pasos.',
  },
  {
    question: '¿Cómo sé si necesito IA o una automatización?',
    answer:
      'Depende de la tarea. Si los pasos y las reglas están claros, una automatización puede ser suficiente. Si hace falta interpretar información o trabajar con entradas menos estructuradas, podemos evaluar si la IA aporta valor.',
  },
  {
    question: '¿Qué debo preparar para la primera conversación?',
    answer:
      'Basta con explicar qué proceso quieres mejorar, qué herramientas utilizas y qué resultado te gustaría conseguir. No necesitas preparar documentación técnica.',
  },
  {
    question: '¿Pueden ayudar con el SEO de mi página?',
    answer:
      'Podemos trabajar en aspectos técnicos como la estructura, los metadatos, el rendimiento y la accesibilidad del contenido. Estas mejoras ayudan a crear una buena base, pero no garantizan una posición concreta en los buscadores.',
  },
  {
    question: '¿Ofrecen soporte y mantenimiento?',
    answer:
      'Las modalidades de soporte y mantenimiento se acuerdan según el proyecto. [DETALLAR LAS MODALIDADES DISPONIBLES ANTES DE PUBLICAR]',
  },
];

/* ───────── Contacto ───────── */
export const contactSection = {
  title: 'Cuéntanos qué necesitas resolver.',
  text: 'Explícanos brevemente qué quieres mejorar o desarrollar. Revisaremos tu consulta y te contactaremos para conversar sobre el caso y los posibles siguientes pasos.',
  messageLabel: '¿Qué necesitas resolver?',
  messagePlaceholder: 'Cuéntanos qué ocurre hoy y qué te gustaría mejorar.',
  channels: [
    { value: 'correo', label: 'Correo' },
    { value: 'whatsapp', label: 'WhatsApp' },
    { value: 'llamada', label: 'Llamada' },
  ],
  submit: 'Enviar consulta',
  privacyNote: 'Utilizaremos los datos para responder a tu consulta de acuerdo con nuestra',
  privacyLinkLabel: 'política de privacidad',
};

export const footer = {
  summary:
    'Desarrollo de software, integración de sistemas y automatización para resolver necesidades concretas de negocio.',
};
