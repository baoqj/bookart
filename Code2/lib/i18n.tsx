"use client"

import { createContext, useContext, useState, type ReactNode, useEffect } from "react"

export type Language = "en" | "fr" | "de" | "es" | "ja" | "ko" | "zh-CN" | "zh-TW"

export const LANGUAGES: { code: Language; name: string; nativeName: string }[] = [
  { code: "en", name: "English", nativeName: "English" },
  { code: "fr", name: "French", nativeName: "Français" },
  { code: "de", name: "German", nativeName: "Deutsch" },
  { code: "es", name: "Spanish", nativeName: "Español" },
  { code: "ja", name: "Japanese", nativeName: "日本語" },
  { code: "ko", name: "Korean", nativeName: "한국어" },
  { code: "zh-CN", name: "Chinese (Simplified)", nativeName: "简体中文" },
  { code: "zh-TW", name: "Chinese (Traditional)", nativeName: "繁體中文" },
]

type TranslationKey = keyof typeof translations.en

const translations = {
  en: {
    // Header
    appName: "Bookart AI",
    freeTrialNoLogin: "Free trial, no login required",
    languageSelector: "Language",
    signIn: "Sign In",
    signUp: "Sign Up",
    signOut: "Sign Out",

    // Hero
    heroTitle: "Transform Text into Beautiful Illustrations",
    heroSubtitle: "AI-powered illustration generator, experience full features without registration",

    // Steps
    step1Title: "Step 1: Upload Manuscript",
    step1Subtitle: "Paste or upload your text content",
    step2Title: "Step 2: Select Chapters",
    step2Subtitle: "Choose paragraphs for illustration",
    step3Title: "Step 3: Choose Style",
    step3Subtitle: "Customize the art style of illustrations",
    step4Title: "Step 4: Generate Illustrations",
    step4Subtitle: "AI is creating beautiful illustrations for you",

    // Upload
    manuscriptLabel: "Manuscript Content",
    manuscriptPlaceholder: "Paste or drag & drop a .txt file here...",
    charactersCount: "characters",
    waitingForInput: "Waiting for input...",
    parseParagraphs: "Parse Paragraphs",
    uploadFile: "Upload File",
    or: "or",
    pasteText: "Paste Text",

    // Select
    selectedCount: "Selected",
    paragraphs: "paragraphs",
    selectAll: "Select All",
    backToEdit: "Back to Edit",
    nextStep: "Next: Set Style",

    // Settings
    illustrationStyle: "Illustration Style",
    realistic: "Realistic",
    realisticDesc: "Photorealistic effects",
    cartoon: "Cartoon",
    cartoonDesc: "Lively and cute illustrations",
    watercolor: "Watercolor",
    watercolorDesc: "Soft artistic feeling",
    sketch: "Sketch",
    sketchDesc: "Simple line beauty",
    colorMode: "Color Mode",
    color: "Color",
    colorDesc: "Rich and vibrant tones",
    monochrome: "Monochrome",
    monochromeDesc: "Black and white or single color",
    backToSelect: "Back to Select",
    startGenerate: "Start Generation",
    illustrations: "illustrations",

    // Generate
    generating: "Generating...",
    generatingDesc: "Generating illustrations for {count} paragraphs, estimated {time} seconds",
    generationComplete: "Generation Complete!",
    generationCompleteDesc: "Successfully generated {count} illustrations. Register to save and download your work.",
    createAgain: "Create Again",
    registerAndSave: "Register & Save",
    viewResults: "View Results",
    downloadAll: "Download All",
    downloadSelected: "Download Selected",
    regenerate: "Regenerate",
    regenerateSelected: "Regenerate Selected",
    editStyle: "Edit Style",
    delete: "Delete",

    // Results
    resultsTitle: "Generated Illustrations",
    selectMode: "Select Mode",
    gridView: "Grid View",
    listView: "List View",
    highlightParagraph: "Highlight corresponding paragraph",

    // Features
    whyChoose: "Why Choose Bookart AI",
    easyToUse: "Easy to Use",
    easyToUseDesc: "No complicated operations, paste text and start creating",
    multipleStyles: "Multiple Styles",
    multipleStylesDesc: "From realistic to cartoon, meet various artistic needs",
    aiPowered: "AI Powered",
    aiPoweredDesc: "Advanced AI technology generates professional illustrations",

    // Footer
    footerText: "© 2025 Bookart AI. Beautiful images for every story",

    // Common
    loading: "Loading...",
    error: "Error",
    success: "Success",
    cancel: "Cancel",
    confirm: "Confirm",
    close: "Close",
    save: "Save",
    download: "Download",

    // Auth Page
    signInTitle: "Welcome Back",
    signInSubtitle: "Sign in to your account to manage your illustrations",
    signUpTitle: "Create Account",
    signUpSubtitle: "Start creating beautiful illustrations today",
    email: "Email",
    password: "Password",
    name: "Name",
    rememberMe: "Remember me",
    forgotPassword: "Forgot password?",
    noAccount: "Don't have an account?",
    haveAccount: "Already have an account?",
    signInWithEmail: "Sign in with email",
    signUpWithEmail: "Sign up with email",

    // Dashboard
    dashboard: "Dashboard",
    myProjects: "My Projects",
    myIllustrations: "My Illustrations",
    totalProjects: "Total Projects",
    totalIllustrations: "Total Illustrations",
    recentActivity: "Recent Activity",
    viewAll: "View All",
    noProjectsYet: "No projects yet",
    noProjectsDesc: "Create your first project to start generating illustrations",
    createProject: "Create Project",
    projectName: "Project Name",
    projectDescription: "Project Description",
    created: "Created",
    updated: "Updated",

    // Dashboard Navigation
    overview: "Overview",
    bookProjects: "Book Projects",
    creditsUsage: "Credits & Usage",
    subscription: "Subscription",
    settings: "Settings",

    // Overview Page
    dashboardWelcome: "Welcome back! Here's your activity overview",
    generatedImages: "Generated Images",
    remainingCredits: "Remaining Credits",
    thisMonth: "This Month",
    quickActions: "Quick Actions",
    newProject: "New Project",
    startNewProject: "Start a new book project",
    generateIllustrations: "Generate Illustrations",
    createNewImages: "Create new images from text",
    upgradeSubscription: "Upgrade Plan",
    getMoreCredits: "Get more credits",
    recentProjects: "Recent Projects",
    open: "Open",

    // Projects Page
    manageYourProjects: "Manage all your book projects",
    searchProjects: "Search projects...",
    paragraphs: "paragraphs",
    noProjectsFound: "No projects found",
    noProjectsFoundDesc: "Try adjusting your search query",

    // Project Detail
    edit: "Edit",
    delete: "Delete",
    projectInfo: "Project Info",
    chaptersIllustrations: "Chapters & Illustrations",
    description: "Description",
    language: "Language",
    chaptersComingSoon: "Chapter management coming soon...",
    settingsComingSoon: "Project settings coming soon...",
  },
  fr: {
    // Header
    appName: "Bookart AI",
    freeTrialNoLogin: "Essai gratuit, sans connexion",
    languageSelector: "Langue",
    signIn: "Se connecter",
    signUp: "S'inscrire",
    signOut: "Se déconnecter",

    // Hero
    heroTitle: "Transformez le texte en belles illustrations",
    heroSubtitle: "Générateur d'illustrations alimenté par l'IA, découvrez toutes les fonctionnalités sans inscription",

    // Steps
    step1Title: "Étape 1 : Télécharger le manuscrit",
    step1Subtitle: "Collez ou téléchargez votre contenu texte",
    step2Title: "Étape 2 : Sélectionner les chapitres",
    step2Subtitle: "Choisissez les paragraphes pour l'illustration",
    step3Title: "Étape 3 : Choisir le style",
    step3Subtitle: "Personnalisez le style artistique des illustrations",
    step4Title: "Étape 4 : Générer des illustrations",
    step4Subtitle: "L'IA crée de belles illustrations pour vous",

    // Upload
    manuscriptLabel: "Contenu du manuscrit",
    manuscriptPlaceholder: "Collez ou déposez un fichier .txt ici...",
    charactersCount: "caractères",
    waitingForInput: "En attente de saisie...",
    parseParagraphs: "Analyser les paragraphes",
    uploadFile: "Télécharger un fichier",
    or: "ou",
    pasteText: "Coller le texte",

    // Select
    selectedCount: "Sélectionné",
    paragraphs: "paragraphes",
    selectAll: "Tout sélectionner",
    backToEdit: "Retour à l'édition",
    nextStep: "Suivant : Définir le style",

    // Settings
    illustrationStyle: "Style d'illustration",
    realistic: "Réaliste",
    realisticDesc: "Effets photoréalistes",
    cartoon: "Dessin animé",
    cartoonDesc: "Illustrations vives et mignonnes",
    watercolor: "Aquarelle",
    watercolorDesc: "Sensation artistique douce",
    sketch: "Esquisse",
    sketchDesc: "Beauté des lignes simples",
    colorMode: "Mode couleur",
    color: "Couleur",
    colorDesc: "Tons riches et vibrants",
    monochrome: "Monochrome",
    monochromeDesc: "Noir et blanc ou couleur unique",
    backToSelect: "Retour à la sélection",
    startGenerate: "Commencer la génération",
    illustrations: "illustrations",

    // Generate
    generating: "Génération...",
    generatingDesc: "Génération d'illustrations pour {count} paragraphes, estimé {time} secondes",
    generationComplete: "Génération terminée !",
    generationCompleteDesc:
      "Généré avec succès {count} illustrations. Inscrivez-vous pour sauvegarder et télécharger votre travail.",
    createAgain: "Créer à nouveau",
    registerAndSave: "S'inscrire et sauvegarder",
    viewResults: "Voir les résultats",
    downloadAll: "Tout télécharger",
    downloadSelected: "Télécharger la sélection",
    regenerate: "Régénérer",
    regenerateSelected: "Régénérer la sélection",
    editStyle: "Modifier le style",
    delete: "Supprimer",

    // Results
    resultsTitle: "Illustrations générées",
    selectMode: "Mode de sélection",
    gridView: "Vue grille",
    listView: "Vue liste",
    highlightParagraph: "Mettre en évidence le paragraphe correspondant",

    // Features
    whyChoose: "Pourquoi choisir Bookart AI",
    easyToUse: "Facile à utiliser",
    easyToUseDesc: "Pas d'opérations compliquées, collez le texte et commencez à créer",
    multipleStyles: "Styles multiples",
    multipleStylesDesc: "Du réaliste au dessin animé, répondre à divers besoins artistiques",
    aiPowered: "Alimenté par l'IA",
    aiPoweredDesc: "La technologie d'IA avancée génère des illustrations professionnelles",

    // Footer
    footerText: "© 2025 Bookart AI. De belles images pour chaque histoire",

    // Common
    loading: "Chargement...",
    error: "Erreur",
    success: "Succès",
    cancel: "Annuler",
    confirm: "Confirmer",
    close: "Fermer",
    save: "Enregistrer",
    download: "Télécharger",

    // Auth Page
    signInTitle: "Bon retour",
    signInSubtitle: "Connectez-vous à votre compte pour gérer vos illustrations",
    signUpTitle: "Créer un compte",
    signUpSubtitle: "Commencez à créer de belles illustrations aujourd'hui",
    email: "Email",
    password: "Mot de passe",
    name: "Nom",
    rememberMe: "Se souvenir de moi",
    forgotPassword: "Mot de passe oublié?",
    noAccount: "Vous n'avez pas de compte?",
    haveAccount: "Vous avez déjà un compte?",
    signInWithEmail: "Se connecter avec email",
    signUpWithEmail: "S'inscrire avec email",

    // Dashboard
    dashboard: "Tableau de bord",
    myProjects: "Mes projets",
    myIllustrations: "Mes illustrations",
    totalProjects: "Total des projets",
    totalIllustrations: "Total des illustrations",
    recentActivity: "Activité récente",
    viewAll: "Voir tout",
    noProjectsYet: "Pas encore de projets",
    noProjectsDesc: "Créez votre premier projet pour commencer à générer des illustrations",
    createProject: "Créer un projet",
    projectName: "Nom du projet",
    projectDescription: "Description du projet",
    created: "Créé",
    updated: "Mis à jour",

    // Dashboard Navigation
    overview: "Vue d'ensemble",
    bookProjects: "Projets de livres",
    creditsUsage: "Crédits & Utilisation",
    subscription: "Abonnement",
    settings: "Paramètres",

    // Overview Page
    dashboardWelcome: "Bienvenue ! Voici un aperçu de votre activité",
    generatedImages: "Images générées",
    remainingCredits: "Crédits restants",
    thisMonth: "Ce mois-ci",
    quickActions: "Actions rapides",
    newProject: "Nouveau projet",
    startNewProject: "Commencez un nouveau projet de livre",
    generateIllustrations: "Générer des illustrations",
    createNewImages: "Créez de nouvelles images à partir de texte",
    upgradeSubscription: "Mettre à niveau votre abonnement",
    getMoreCredits: "Obtenir plus de crédits",
    recentProjects: "Projets récents",
    open: "Ouvrir",
  },
  de: {
    appName: "Bookart AI",
    freeTrialNoLogin: "Kostenlose Testversion, keine Anmeldung erforderlich",
    languageSelector: "Sprache",
    signIn: "Anmelden",
    signUp: "Registrieren",
    signOut: "Abmelden",

    // Hero
    heroTitle: "Verwandeln Sie Text in schöne Illustrationen",
    heroSubtitle: "KI-gestützter Illustrationsgenerator, erleben Sie alle Funktionen ohne Registrierung",

    // Steps
    step1Title: "Schritt 1: Manuskript hochladen",
    step1Subtitle: "Fügen Sie Ihren Textinhalt ein oder laden Sie ihn hoch",
    step2Title: "Schritt 2: Kapitel auswählen",
    step2Subtitle: "Wählen Sie Absätze für die Illustration",
    step3Title: "Schritt 3: Stil wählen",
    step3Subtitle: "Passen Sie den Kunststil der Illustrationen an",
    step4Title: "Schritt 4: Illustrationen generieren",
    step4Subtitle: "KI erstellt wunderschöne Illustrationen für Sie",

    // Upload
    manuscriptLabel: "Manuskriptinhalt",
    manuscriptPlaceholder: "Fügen Sie hier eine .txt-Datei ein oder ziehen Sie sie per Drag & Drop...",
    charactersCount: "Zeichen",
    waitingForInput: "Warte auf Eingabe...",
    parseParagraphs: "Absätze analysieren",
    uploadFile: "Datei hochladen",
    or: "oder",
    pasteText: "Text einfügen",

    // Select
    selectedCount: "Ausgewählt",
    paragraphs: "Absätze",
    selectAll: "Alle auswählen",
    backToEdit: "Zurück zur Bearbeitung",
    nextStep: "Weiter: Stil festlegen",

    // Settings
    illustrationStyle: "Illustrationsstil",
    realistic: "Realistisch",
    realisticDesc: "Fotorealistische Effekte",
    cartoon: "Cartoon",
    cartoonDesc: "Lebendige und niedliche Illustrationen",
    watercolor: "Aquarell",
    watercolorDesc: "Sanftes künstlerisches Gefühl",
    sketch: "Skizze",
    sketchDesc: "Einfache Linienschönheit",
    colorMode: "Farbmodus",
    color: "Farbe",
    colorDesc: "Reiche und lebendige Töne",
    monochrome: "Monochrom",
    monochromeDesc: "Schwarz-weiß oder einzelne Farbe",
    backToSelect: "Zurück zur Auswahl",
    startGenerate: "Generierung starten",
    illustrations: "Illustrationen",

    // Generate
    generating: "Generierung...",
    generatingDesc: "Generiere Illustrationen für {count} Absätze, geschätzt {time} Sekunden",
    generationComplete: "Generierung abgeschlossen!",
    generationCompleteDesc:
      "Erfolgreich {count} Illustrationen generiert. Registrieren Sie sich, um Ihre Arbeit zu speichern und herunterzuladen.",
    createAgain: "Erneut erstellen",
    registerAndSave: "Registrieren & Speichern",
    viewResults: "Ergebnisse anzeigen",
    downloadAll: "Alle herunterladen",
    downloadSelected: "Ausgewählte herunterladen",
    regenerate: "Regenerieren",
    regenerateSelected: "Ausgewählte regenerieren",
    editStyle: "Stil bearbeiten",
    delete: "Löschen",

    // Results
    resultsTitle: "Generierte Illustrationen",
    selectMode: "Auswahlmodus",
    gridView: "Rasteransicht",
    listView: "Listenansicht",
    highlightParagraph: "Entsprechenden Absatz hervorheben",

    // Features
    whyChoose: "Warum Bookart AI wählen",
    easyToUse: "Einfach zu bedienen",
    easyToUseDesc: "Keine komplizierten Operationen, Text einfügen und mit der Erstellung beginnen",
    multipleStyles: "Mehrere Stile",
    multipleStylesDesc: "Von realistisch bis Cartoon, erfüllt verschiedene künstlerische Bedürfnisse",
    aiPowered: "KI-gestützt",
    aiPoweredDesc: "Fortschrittliche KI-Technologie generiert professionelle Illustrationen",

    // Footer
    footerText: "© 2025 Bookart AI. Schöne Bilder für jede Geschichte",

    // Common
    loading: "Laden...",
    error: "Fehler",
    success: "Erfolg",
    cancel: "Abbrechen",
    confirm: "Bestätigen",
    close: "Schließen",
    save: "Speichern",
    download: "Herunterladen",

    // Auth Page
    signInTitle: "Willkommen zurück",
    signInSubtitle: "Melden Sie sich bei Ihrem Konto an, um Ihre Illustrationen zu verwalten",
    signUpTitle: "Konto erstellen",
    signUpSubtitle: "Beginnen Sie noch heute mit der Erstellung schöner Illustrationen",
    email: "E-Mail",
    password: "Passwort",
    name: "Name",
    rememberMe: "Angemeldet bleiben",
    forgotPassword: "Passwort vergessen?",
    noAccount: "Noch kein Konto?",
    haveAccount: "Haben Sie bereits ein Konto?",
    signInWithEmail: "Mit E-Mail anmelden",
    signUpWithEmail: "Mit E-Mail registrieren",

    // Dashboard
    dashboard: "Dashboard",
    myProjects: "Meine Projekte",
    myIllustrations: "Meine Illustrationen",
    totalProjects: "Gesamtprojekte",
    totalIllustrations: "Gesamtillustrationen",
    recentActivity: "Letzte Aktivität",
    viewAll: "Alle anzeigen",
    noProjectsYet: "Noch keine Projekte",
    noProjectsDesc: "Erstellen Sie Ihr erstes Projekt, um mit der Generierung von Illustrationen zu beginnen",
    createProject: "Projekt erstellen",
    projectName: "Projektname",
    projectDescription: "Projektbeschreibung",
    created: "Erstellt",
    updated: "Aktualisiert",

    // Dashboard Navigation
    overview: "Übersicht",
    bookProjects: "Buchprojekte",
    creditsUsage: "Credits & Nutzung",
    subscription: "Abo",
    settings: "Einstellungen",

    // Overview Page
    dashboardWelcome: "Willkommen zurück! Hier ist eine Übersicht Ihrer Aktivität",
    generatedImages: "Generierte Bilder",
    remainingCredits: "Verbleibende Credits",
    thisMonth: "Diesen Monat",
    quickActions: "Schnelle Aktionen",
    newProject: "Neues Projekt",
    startNewProject: "Starten Sie ein neues Buchprojekt",
    generateIllustrations: "Illustrationen generieren",
    createNewImages: "Erstellen Sie neue Bilder aus Text",
    upgradeSubscription: "Abo erweitern",
    getMoreCredits: "Mehr Credits erhalten",
    recentProjects: "Letzte Projekte",
    open: "Öffnen",
  },
  es: {
    appName: "Bookart AI",
    freeTrialNoLogin: "Prueba gratuita, sin necesidad de iniciar sesión",
    languageSelector: "Idioma",
    signIn: "Iniciar sesión",
    signUp: "Registrarse",
    signOut: "Cerrar sesión",

    // Hero
    heroTitle: "Transforma texto en hermosas ilustraciones",
    heroSubtitle: "Generador de ilustraciones impulsado por IA, experimenta todas las funciones sin registro",

    // Steps
    step1Title: "Paso 1: Subir manuscrito",
    step1Subtitle: "Pega o sube tu contenido de texto",
    step2Title: "Paso 2: Seleccionar capítulos",
    step2Subtitle: "Elige párrafos para ilustración",
    step3Title: "Paso 3: Elegir estilo",
    step3Subtitle: "Personaliza el estilo artístico de las ilustraciones",
    step4Title: "Paso 4: Generar ilustraciones",
    step4Subtitle: "La IA está creando hermosas ilustraciones para ti",

    // Upload
    manuscriptLabel: "Contenido del manuscrito",
    manuscriptPlaceholder: "Pega o arrastra y suelta un archivo .txt aquí...",
    charactersCount: "caracteres",
    waitingForInput: "Esperando entrada...",
    parseParagraphs: "Analizar párrafos",
    uploadFile: "Subir archivo",
    or: "o",
    pasteText: "Pegar texto",

    // Select
    selectedCount: "Seleccionado",
    paragraphs: "párrafos",
    selectAll: "Seleccionar todo",
    backToEdit: "Volver a editar",
    nextStep: "Siguiente: Establecer estilo",

    // Settings
    illustrationStyle: "Estilo de ilustración",
    realistic: "Realista",
    realisticDesc: "Efectos fotorrealistas",
    cartoon: "Dibujos animados",
    cartoonDesc: "Ilustraciones animadas y lindas",
    watercolor: "Acuarela",
    watercolorDesc: "Sensación artística suave",
    sketch: "Boceto",
    sketchDesc: "Belleza de líneas simples",
    colorMode: "Modo de color",
    color: "Color",
    colorDesc: "Tonos ricos y vibrantes",
    monochrome: "Monocromo",
    monochromeDesc: "Blanco y negro o color único",
    backToSelect: "Volver a seleccionar",
    startGenerate: "Iniciar generación",
    illustrations: "ilustraciones",

    // Generate
    generating: "Generando...",
    generatingDesc: "Generando ilustraciones para {count} párrafos, estimado {time} segundos",
    generationComplete: "¡Generación completa!",
    generationCompleteDesc:
      "Generadas con éxito {count} ilustraciones. Regístrate para guardar y descargar tu trabajo.",
    createAgain: "Crear de nuevo",
    registerAndSave: "Registrarse y guardar",
    viewResults: "Ver resultados",
    downloadAll: "Descargar todo",
    downloadSelected: "Descargar seleccionados",
    regenerate: "Regenerar",
    regenerateSelected: "Regenerar seleccionados",
    editStyle: "Editar estilo",
    delete: "Eliminar",

    // Results
    resultsTitle: "Ilustraciones generadas",
    selectMode: "Modo de selección",
    gridView: "Vista de cuadrícula",
    listView: "Vista de lista",
    highlightParagraph: "Resaltar párrafo correspondiente",

    // Features
    whyChoose: "Por qué elegir Bookart AI",
    easyToUse: "Fácil de usar",
    easyToUseDesc: "Sin operaciones complicadas, pega el texto y comienza a crear",
    multipleStyles: "Múltiples estilos",
    multipleStylesDesc: "Desde realista hasta dibujos animados, satisface diversas necesidades artísticas",
    aiPowered: "Impulsado por IA",
    aiPoweredDesc: "La tecnología de IA avanzada genera ilustraciones profesionales",

    // Footer
    footerText: "© 2025 Bookart AI. Hermosas imágenes para cada historia",

    // Common
    loading: "Cargando...",
    error: "Error",
    success: "Éxito",
    cancel: "Cancelar",
    confirm: "Confirmar",
    close: "Cerrar",
    save: "Guardar",
    download: "Descargar",

    // Auth Page
    signInTitle: "Bienvenido de nuevo",
    signInSubtitle: "Inicia sesión en tu cuenta para gestionar tus ilustraciones",
    signUpTitle: "Crear cuenta",
    signUpSubtitle: "Comienza a crear hermosas ilustraciones hoy",
    email: "Correo electrónico",
    password: "Contraseña",
    name: "Nombre",
    rememberMe: "Recuérdame",
    forgotPassword: "¿Olvidaste tu contraseña?",
    noAccount: "¿No tienes una cuenta?",
    haveAccount: "¿Ya tienes una cuenta?",
    signInWithEmail: "Iniciar sesión con correo electrónico",
    signUpWithEmail: "Registrarse con correo electrónico",

    // Dashboard
    dashboard: "Panel de control",
    myProjects: "Mis proyectos",
    myIllustrations: "Mis ilustraciones",
    totalProjects: "Total de proyectos",
    totalIllustrations: "Total de ilustraciones",
    recentActivity: "Actividad reciente",
    viewAll: "Ver todo",
    noProjectsYet: "Aún no hay proyectos",
    noProjectsDesc: "Crea tu primer proyecto para comenzar a generar ilustraciones",
    createProject: "Crear proyecto",
    projectName: "Nombre del proyecto",
    projectDescription: "Descripción del proyecto",
    created: "Creado",
    updated: "Actualizado",

    // Dashboard Navigation
    overview: "Resumen",
    bookProjects: "Proyectos de libros",
    creditsUsage: "Créditos & Uso",
    subscription: "Suscripción",
    settings: "Configuración",

    // Overview Page
    dashboardWelcome: "¡Bienvenido de nuevo! Aquí tienes un resumen de tu actividad",
    generatedImages: "Imágenes generadas",
    remainingCredits: "Créditos restantes",
    thisMonth: "Este mes",
    quickActions: "Acciones rápidas",
    newProject: "Nuevo proyecto",
    startNewProject: "Comienza un nuevo proyecto de libro",
    generateIllustrations: "Generar ilustraciones",
    createNewImages: "Crea nuevas imágenes a partir de texto",
    upgradeSubscription: "Actualizar suscripción",
    getMoreCredits: "Obtener más créditos",
    recentProjects: "Proyectos recientes",
    open: "Abrir",
  },
  ja: {
    appName: "Bookart AI",
    freeTrialNoLogin: "無料トライアル、ログイン不要",
    languageSelector: "言語",
    signIn: "ログイン",
    signUp: "新規登録",
    signOut: "ログアウト",

    // Hero
    heroTitle: "テキストを美しいイラストに変換",
    heroSubtitle: "AI駆動のイラストジェネレーター、登録なしで全機能を体験",

    // Steps
    step1Title: "ステップ1：原稿をアップロード",
    step1Subtitle: "テキストコンテンツを貼り付けまたはアップロード",
    step2Title: "ステップ2：章を選択",
    step2Subtitle: "イラスト用の段落を選択",
    step3Title: "ステップ3：スタイルを選択",
    step3Subtitle: "イラストのアートスタイルをカスタマイズ",
    step4Title: "ステップ4：イラストを生成",
    step4Subtitle: "AIが美しいイラストを作成しています",

    // Upload
    manuscriptLabel: "原稿コンテンツ",
    manuscriptPlaceholder: ".txtファイルを貼り付けまたはドラッグ＆ドロップ...",
    charactersCount: "文字",
    waitingForInput: "入力待ち...",
    parseParagraphs: "段落を解析",
    uploadFile: "ファイルをアップロード",
    or: "または",
    pasteText: "テキストを貼り付け",

    // Select
    selectedCount: "選択済み",
    paragraphs: "段落",
    selectAll: "すべて選択",
    backToEdit: "編集に戻る",
    nextStep: "次へ：スタイルを設定",

    // Settings
    illustrationStyle: "イラストスタイル",
    realistic: "リアリスティック",
    realisticDesc: "写真のようなリアルな効果",
    cartoon: "カートゥーン",
    cartoonDesc: "活気があってかわいいイラスト",
    watercolor: "水彩",
    watercolorDesc: "柔らかい芸術的な感覚",
    sketch: "スケッチ",
    sketchDesc: "シンプルな線の美しさ",
    colorMode: "カラーモード",
    color: "カラー",
    colorDesc: "豊かで鮮やかな色調",
    monochrome: "モノクローム",
    monochromeDesc: "白黒または単色",
    backToSelect: "選択に戻る",
    startGenerate: "生成開始",
    illustrations: "イラスト",

    // Generate
    generating: "生成中...",
    generatingDesc: "{count}段落のイラストを生成中、推定{time}秒",
    generationComplete: "生成完了！",
    generationCompleteDesc: "{count}個のイラストを正常に生成しました。登録して作品を保存・ダウンロードできます。",
    createAgain: "再度作成",
    registerAndSave: "登録して保存",
    viewResults: "結果を表示",
    downloadAll: "すべてダウンロード",
    downloadSelected: "選択をダウンロード",
    regenerate: "再生成",
    regenerateSelected: "選択を再生成",
    editStyle: "スタイルを編集",
    delete: "削除",

    // Results
    resultsTitle: "生成されたイラスト",
    selectMode: "選択モード",
    gridView: "グリッドビュー",
    listView: "リストビュー",
    highlightParagraph: "対応する段落をハイライト",

    // Features
    whyChoose: "Bookart AIを選ぶ理由",
    easyToUse: "使いやすい",
    easyToUseDesc: "複雑な操作は不要、テキストを貼り付けて作成開始",
    multipleStyles: "複数のスタイル",
    multipleStylesDesc: "リアルからカートゥーンまで、さまざまな芸術的ニーズに対応",
    aiPowered: "AI駆動",
    aiPoweredDesc: "先進的なAI技術がプロフェッショナルなイラストを生成",

    // Footer
    footerText: "© 2025 Bookart AI. すべての物語に美しい画像を",

    // Common
    loading: "読み込み中...",
    error: "エラー",
    success: "成功",
    cancel: "キャンセル",
    confirm: "確認",
    close: "閉じる",
    save: "保存",
    download: "ダウンロード",

    // Auth Page
    signInTitle: "おかえりなさい",
    signInSubtitle: "アカウントにログインしてイラストを管理",
    signUpTitle: "アカウント作成",
    signUpSubtitle: "今日から美しいイラストを作成しましょう",
    email: "メールアドレス",
    password: "パスワード",
    name: "名前",
    rememberMe: "ログイン状態を保持",
    forgotPassword: "パスワードをお忘れですか？",
    noAccount: "アカウントをお持ちでない方",
    haveAccount: "すでにアカウントをお持ちの方",
    signInWithEmail: "メールでログイン",
    signUpWithEmail: "メールで登録",

    // Dashboard
    dashboard: "ダッシュボード",
    myProjects: "マイプロジェクト",
    myIllustrations: "マイイラスト",
    totalProjects: "総プロジェクト数",
    totalIllustrations: "総イラスト数",
    recentActivity: "最近のアクティビティ",
    viewAll: "すべて表示",
    noProjectsYet: "まだプロジェクトがありません",
    noProjectsDesc: "最初のプロジェクトを作成してイラスト生成を開始",
    createProject: "プロジェクト作成",
    projectName: "プロジェクト名",
    projectDescription: "プロジェクトの説明",
    created: "作成日",
    updated: "更新日",

    // Dashboard Navigation
    overview: "概要",
    bookProjects: "書籍プロジェクト",
    creditsUsage: "クレジット & 使用",
    subscription: "サブスクリプション",
    settings: "設定",

    // Overview Page
    dashboardWelcome: "おかえりなさい！ここはあなたの活動概要です",
    generatedImages: "生成された画像",
    remainingCredits: "残りのクレジット",
    thisMonth: "今月",
    quickActions: "クイックアクション",
    newProject: "新しいプロジェクト",
    startNewProject: "新しい書籍プロジェクトを開始",
    generateIllustrations: "イラストを生成",
    createNewImages: "テキストから新しい画像を作成",
    upgradeSubscription: "プランをアップグレード",
    getMoreCredits: "クレジットを増やす",
    recentProjects: "最近のプロジェクト",
    open: "開く",
  },
  ko: {
    appName: "Bookart AI",
    freeTrialNoLogin: "무료 체험, 로그인 불필요",
    languageSelector: "언어",
    signIn: "로그인",
    signUp: "회원가입",
    signOut: "로그아웃",

    // Hero
    heroTitle: "텍스트를 아름다운 일러스트로 변환",
    heroSubtitle: "AI 기반 일러스트 생성기, 등록 없이 모든 기능 체험",

    // Steps
    step1Title: "1단계: 원고 업로드",
    step1Subtitle: "텍스트 콘텐츠 붙여넣기 또는 업로드",
    step2Title: "2단계: 챕터 선택",
    step2Subtitle: "일러스트용 단락 선택",
    step3Title: "3단계: 스타일 선택",
    step3Subtitle: "일러스트의 예술 스타일 맞춤 설정",
    step4Title: "4단계: 일러스트 생성",
    step4Subtitle: "AI가 아름다운 일러스트를 만들고 있습니다",

    // Upload
    manuscriptLabel: "원고 내용",
    manuscriptPlaceholder: ".txt 파일을 붙여넣거나 드래그 앤 드롭...",
    charactersCount: "자",
    waitingForInput: "입력 대기 중...",
    parseParagraphs: "단락 분석",
    uploadFile: "파일 업로드",
    or: "또는",
    pasteText: "텍스트 붙여넣기",

    // Select
    selectedCount: "선택됨",
    paragraphs: "단락",
    selectAll: "모두 선택",
    backToEdit: "편집으로 돌아가기",
    nextStep: "다음: 스타일 설정",

    // Settings
    illustrationStyle: "일러스트 스타일",
    realistic: "사실적",
    realisticDesc: "사진처럼 실감나는 효과",
    cartoon: "만화",
    cartoonDesc: "활기차고 귀여운 일러스트",
    watercolor: "수채화",
    watercolorDesc: "부드러운 예술적 느낌",
    sketch: "스케치",
    sketchDesc: "간단한 선의 아름다움",
    colorMode: "색상 모드",
    color: "컬러",
    colorDesc: "풍부하고 생생한 톤",
    monochrome: "단색",
    monochromeDesc: "흑백 또는 단일 색상",
    backToSelect: "선택으로 돌아가기",
    startGenerate: "생성 시작",
    illustrations: "일러스트",

    // Generate
    generating: "생성 중...",
    generatingDesc: "{count}개 단락의 일러스트 생성 중, 예상 {time}초",
    generationComplete: "생성 완료!",
    generationCompleteDesc: "{count}개의 일러스트를 성공적으로 생성했습니다. 등록하여 작품을 저장하고 다운로드하세요.",
    createAgain: "다시 만들기",
    registerAndSave: "등록 및 저장",
    viewResults: "결과 보기",
    downloadAll: "전체 다운로드",
    downloadSelected: "선택 다운로드",
    regenerate: "재생성",
    regenerateSelected: "선택 재생성",
    editStyle: "스타일 편집",
    delete: "삭제",

    // Results
    resultsTitle: "생성된 일러스트",
    selectMode: "선택 모드",
    gridView: "그리드 뷰",
    listView: "리스트 뷰",
    highlightParagraph: "해당 단락 강조",

    // Features
    whyChoose: "Bookart AI를 선택하는 이유",
    easyToUse: "사용하기 쉬움",
    easyToUseDesc: "복잡한 작업 없이 텍스트를 붙여넣고 만들기 시작",
    multipleStyles: "다양한 스타일",
    multipleStylesDesc: "사실적에서 만화까지, 다양한 예술적 요구 충족",
    aiPowered: "AI 기반",
    aiPoweredDesc: "고급 AI 기술로 전문적인 일러스트 생성",

    // Footer
    footerText: "© 2025 Bookart AI. 모든 이야기를 위한 아름다운 이미지",

    // Common
    loading: "로딩 중...",
    error: "오류",
    success: "성공",
    cancel: "취소",
    confirm: "확인",
    close: "닫기",
    save: "저장",
    download: "다운로드",

    // Auth Page
    signInTitle: "다시 오신 것을 환영합니다",
    signInSubtitle: "계정에 로그인하여 일러스트를 관리하세요",
    signUpTitle: "계정 만들기",
    signUpSubtitle: "오늘부터 아름다운 일러스트 만들기 시작",
    email: "이메일",
    password: "비밀번호",
    name: "이름",
    rememberMe: "로그인 상태 유지",
    forgotPassword: "비밀번호를 잊으셨나요?",
    noAccount: "계정이 없으신가요?",
    haveAccount: "이미 계정이 있으신가요?",
    signInWithEmail: "이메일로 로그인",
    signUpWithEmail: "이메일로 회원가입",

    // Dashboard
    dashboard: "대시보드",
    myProjects: "내 프로젝트",
    myIllustrations: "내 일러스트",
    totalProjects: "총 프로젝트",
    totalIllustrations: "총 일러스트",
    recentActivity: "최근 활동",
    viewAll: "전체 보기",
    noProjectsYet: "아직 프로젝트가 없습니다",
    noProjectsDesc: "첫 번째 프로젝트를 만들어 일러스트 생성 시작",
    createProject: "프로젝트 만들기",
    projectName: "프로젝트 이름",
    projectDescription: "프로젝트 설명",
    created: "생성일",
    updated: "수정일",

    // Dashboard Navigation
    overview: "개요",
    bookProjects: "책 프로젝트",
    creditsUsage: "크레딧 & 사용",
    subscription: "구독",
    settings: "설정",

    // Overview Page
    dashboardWelcome: "안녕하세요! 여기는 활동 개요입니다",
    generatedImages: "생성된 이미지",
    remainingCredits: "남은 크레딧",
    thisMonth: "이번 달",
    quickActions: "빠른 작업",
    newProject: "새 프로젝트",
    startNewProject: "새 책 프로젝트 시작",
    generateIllustrations: "일러스트 생성",
    createNewImages: "텍스트에서 새로운 이미지 생성",
    upgradeSubscription: "구독 업그레이드",
    getMoreCredits: "크레딧 더 얻기",
    recentProjects: "최근 프로젝트",
    open: "열기",
  },
  "zh-CN": {
    appName: "Bookart AI",
    freeTrialNoLogin: "免费试用，无需登录",
    languageSelector: "语言",
    signIn: "登录",
    signUp: "注册",
    signOut: "退出",

    // Hero
    heroTitle: "将文字转化为精美插图",
    heroSubtitle: "AI驱动的插图生成器，无需注册即可体验完整功能",

    // Steps
    step1Title: "步骤 1: 上传书稿",
    step1Subtitle: "粘贴或上传您的文本内容",
    step2Title: "步骤 2: 选择章节",
    step2Subtitle: "选择需要生成插图的段落",
    step3Title: "步骤 3: 选择风格",
    step3Subtitle: "自定义插图的艺术风格",
    step4Title: "步骤 4: 生成插图",
    step4Subtitle: "AI正在为您创作精美插图",

    // Upload
    manuscriptLabel: "书稿内容",
    manuscriptPlaceholder: "粘贴或拖拽 .txt 文件到此处...",
    charactersCount: "字符",
    waitingForInput: "等待输入...",
    parseParagraphs: "解析段落",
    uploadFile: "上传文件",
    or: "或",
    pasteText: "粘贴文本",

    // Select
    selectedCount: "已选择",
    paragraphs: "个段落",
    selectAll: "全选",
    backToEdit: "返回编辑",
    nextStep: "下一步：设置风格",

    // Settings
    illustrationStyle: "插图风格",
    realistic: "写实风格",
    realisticDesc: "逼真的照片级效果",
    cartoon: "卡通风格",
    cartoonDesc: "活泼可爱的插画",
    watercolor: "水彩风格",
    watercolorDesc: "柔和的艺术感",
    sketch: "素描风格",
    sketchDesc: "简约的线条美",
    colorMode: "色彩模式",
    color: "彩色",
    colorDesc: "丰富多彩的色调",
    monochrome: "单色",
    monochromeDesc: "黑白或单一色系",
    backToSelect: "返回选择",
    startGenerate: "开始生成",
    illustrations: "张插图",

    // Generate
    generating: "生成中...",
    generatingDesc: "正在为 {count} 个段落生成插图，预计需要 {time} 秒",
    generationComplete: "生成完成！",
    generationCompleteDesc: "已成功生成 {count} 张插图。注册账户可保存和下载您的作品。",
    createAgain: "再次创作",
    registerAndSave: "注册并保存",
    viewResults: "查看结果",
    downloadAll: "全部下载",
    downloadSelected: "下载选中",
    regenerate: "重新生成",
    regenerateSelected: "重新生成选中",
    editStyle: "编辑风格",
    delete: "删除",

    // Results
    resultsTitle: "生成的插图",
    selectMode: "选择模式",
    gridView: "网格视图",
    listView: "列表视图",
    highlightParagraph: "高亮显示对应段落",

    // Features
    whyChoose: "为什么选择 Bookart AI",
    easyToUse: "简单易用",
    easyToUseDesc: "无需复杂操作，粘贴文本即可开始创作",
    multipleStyles: "多种风格",
    multipleStylesDesc: "从写实到卡通，满足各种艺术需求",
    aiPowered: "AI驱动",
    aiPoweredDesc: "先进的AI技术，生成专业级插图",

    // Footer
    footerText: "© 2025 Bookart AI. 让每个故事都有美丽的画面",

    // Common
    loading: "加载中...",
    error: "错误",
    success: "成功",
    cancel: "取消",
    confirm: "确认",
    close: "关闭",
    save: "保存",
    download: "下载",

    // Auth Page
    signInTitle: "欢迎回来",
    signInSubtitle: "登录您的账户以管理您的插图",
    signUpTitle: "创建账户",
    signUpSubtitle: "立即开始创建精美插图",
    email: "邮箱",
    password: "密码",
    name: "姓名",
    rememberMe: "记住我",
    forgotPassword: "忘记密码？",
    noAccount: "还没有账户？",
    haveAccount: "已有账户？",
    signInWithEmail: "使用邮箱登录",
    signUpWithEmail: "使用邮箱注册",

    // Dashboard
    dashboard: "仪表板",
    myProjects: "我的项目",
    myIllustrations: "我的插图",
    totalProjects: "总项目数",
    totalIllustrations: "总插图数",
    recentActivity: "最近活动",
    viewAll: "查看全部",
    noProjectsYet: "还没有项目",
    noProjectsDesc: "创建您的第一个项目以开始生成插图",
    createProject: "创建项目",
    projectName: "项目名称",
    projectDescription: "项目描述",
    created: "创建于",
    updated: "更新于",

    // Dashboard Navigation
    overview: "概览",
    bookProjects: "书籍项目",
    creditsUsage: "信用 & 使用",
    subscription: "订阅",
    settings: "设置",

    // Overview Page
    dashboardWelcome: "欢迎回来！这里是您的活动概览",
    generatedImages: "生成的图片",
    remainingCredits: "剩余信用",
    thisMonth: "本月",
    quickActions: "快速操作",
    newProject: "新建项目",
    startNewProject: "开始一个新书籍项目",
    generateIllustrations: "生成插图",
    createNewImages: "从文本创建新图片",
    upgradeSubscription: "升级计划",
    getMoreCredits: "获取更多信用",
    recentProjects: "最近项目",
    open: "打开",
  },
  "zh-TW": {
    appName: "Bookart AI",
    freeTrialNoLogin: "免費試用，無需登入",
    languageSelector: "語言",
    signIn: "登入",
    signUp: "註冊",
    signOut: "登出",

    // Hero
    heroTitle: "將文字轉化為精美插圖",
    heroSubtitle: "AI驅動的插圖生成器，無需註冊即可體驗完整功能",

    // Steps
    step1Title: "步驟 1: 上傳書稿",
    step1Subtitle: "貼上或上傳您的文字內容",
    step2Title: "步驟 2: 選擇章節",
    step2Subtitle: "選擇需要生成插圖的段落",
    step3Title: "步驟 3: 選擇風格",
    step3Subtitle: "自訂插圖的藝術風格",
    step4Title: "步驟 4: 生成插圖",
    step4Subtitle: "AI正在為您創作精美插圖",

    // Upload
    manuscriptLabel: "書稿內容",
    manuscriptPlaceholder: "貼上或拖曳 .txt 檔案到此處...",
    charactersCount: "字元",
    waitingForInput: "等待輸入...",
    parseParagraphs: "解析段落",
    uploadFile: "上傳檔案",
    or: "或",
    pasteText: "貼上文字",

    // Select
    selectedCount: "已選擇",
    paragraphs: "個段落",
    selectAll: "全選",
    backToEdit: "返回編輯",
    nextStep: "下一步：設定風格",

    // Settings
    illustrationStyle: "插圖風格",
    realistic: "寫實風格",
    realisticDesc: "逼真的照片級效果",
    cartoon: "卡通風格",
    cartoonDesc: "活潑可愛的插畫",
    watercolor: "水彩風格",
    watercolorDesc: "柔和的藝術感",
    sketch: "素描風格",
    sketchDesc: "簡約的線條美",
    colorMode: "色彩模式",
    color: "彩色",
    colorDesc: "豐富多彩的色調",
    monochrome: "單色",
    monochromeDesc: "黑白或單一色系",
    backToSelect: "返回選擇",
    startGenerate: "開始生成",
    illustrations: "張插圖",

    // Generate
    generating: "生成中...",
    generatingDesc: "正在為 {count} 個段落生成插圖，預計需要 {time} 秒",
    generationComplete: "生成完成！",
    generationCompleteDesc: "已成功生成 {count} 張插圖。註冊帳戶可儲存和下載您的作品。",
    createAgain: "再次創作",
    registerAndSave: "註冊並儲存",
    viewResults: "檢視結果",
    downloadAll: "全部下載",
    downloadSelected: "下載選中",
    regenerate: "重新生成",
    regenerateSelected: "重新生成選中",
    editStyle: "編輯風格",
    delete: "刪除",

    // Results
    resultsTitle: "生成的插圖",
    selectMode: "選擇模式",
    gridView: "網格檢視",
    listView: "列表檢視",
    highlightParagraph: "醒目提示對應段落",

    // Features
    whyChoose: "為什麼選擇 Bookart AI",
    easyToUse: "簡單易用",
    easyToUseDesc: "無需複雜操作，貼上文字即可開始創作",
    multipleStyles: "多種風格",
    multipleStylesDesc: "從寫實到卡通，滿足各種藝術需求",
    aiPowered: "AI驅動",
    aiPoweredDesc: "先進的AI技術，生成專業級插圖",

    // Footer
    footerText: "© 2025 Bookart AI. 讓每個故事都有美麗的畫面",

    // Common
    loading: "載入中...",
    error: "錯誤",
    success: "成功",
    cancel: "取消",
    confirm: "確認",
    close: "關閉",
    save: "儲存",
    download: "下載",

    // Auth Page
    signInTitle: "歡迎回來",
    signInSubtitle: "登入您的帳戶以管理您的插圖",
    signUpTitle: "建立帳戶",
    signUpSubtitle: "立即開始創作精美插圖",
    email: "電郵",
    password: "密碼",
    name: "姓名",
    rememberMe: "記住我",
    forgotPassword: "忘記密碼？",
    noAccount: "還沒有帳戶？",
    haveAccount: "已有帳戶？",
    signInWithEmail: "使用電郵登入",
    signUpWithEmail: "使用電郵註冊",

    // Dashboard
    dashboard: "儀表板",
    myProjects: "我的專案",
    myIllustrations: "我的插圖",
    totalProjects: "總專案數",
    totalIllustrations: "總插圖數",
    recentActivity: "最近活動",
    viewAll: "查看全部",
    noProjectsYet: "還沒有專案",
    noProjectsDesc: "建立您的第一個專案以開始生成插圖",
    createProject: "建立專案",
    projectName: "專案名稱",
    projectDescription: "專案描述",
    created: "建立於",
    updated: "更新於",

    // Dashboard Navigation
    overview: "概覽",
    bookProjects: "書籍專案",
    creditsUsage: "信用 & 使用",
    subscription: "訂閱",
    settings: "設定",

    // Overview Page
    dashboardWelcome: "歡迎回來！這裡是您的活動概覽",
    generatedImages: "生成的圖片",
    remainingCredits: "剩餘信用",
    thisMonth: "本月",
    quickActions: "快速操作",
    newProject: "新建專案",
    startNewProject: "開始一個新書籍專案",
    generateIllustrations: "生成插圖",
    createNewImages: "從文字創建新圖片",
    upgradeSubscription: "升級計劃",
    getMoreCredits: "獲取更多信用",
    recentProjects: "最近專案",
    open: "打開",
  },
}

interface I18nContextType {
  language: Language
  setLanguage: (lang: Language) => void
  t: (key: TranslationKey, params?: Record<string, string | number>) => string
}

const I18nContext = createContext<I18nContextType | undefined>(undefined)

export function I18nProvider({ children }: { children: ReactNode }) {
  const [language, setLanguageState] = useState<Language>("zh-CN")

  useEffect(() => {
    const saved = localStorage.getItem("bookart-language") as Language
    if (saved && LANGUAGES.find((l) => l.code === saved)) {
      setLanguageState(saved)
    }
  }, [])

  const setLanguage = (lang: Language) => {
    setLanguageState(lang)
    localStorage.setItem("bookart-language", lang)
  }

  const t = (key: TranslationKey, params?: Record<string, string | number>): string => {
    let text = translations[language][key] || translations.en[key] || key
    if (params) {
      Object.entries(params).forEach(([k, v]) => {
        text = text.replace(`{${k}}`, String(v))
      })
    }
    return text
  }

  return <I18nContext.Provider value={{ language, setLanguage, t }}>{children}</I18nContext.Provider>
}

export function useI18n() {
  const context = useContext(I18nContext)
  if (!context) throw new Error("useI18n must be used within I18nProvider")
  return context
}
