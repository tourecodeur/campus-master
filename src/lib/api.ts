import axios from 'axios'
import useAuthStore from '@/lib/store' // Ajoutez cet import en haut du fichier
/**
 * Base URL du backend Spring Boot.
 * Mettre dans .env.local : NEXT_PUBLIC_API_URL=http://localhost:8080
 */
const API_BASE = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:8080'

export const api = axios.create({
  baseURL: API_BASE,
  headers: { 'Content-Type': 'application/json' },
})


// ✅ NOUVEAU CODE
api.interceptors.request.use((config) => {
  // Récupérer le token depuis Zustand au lieu de localStorage
  const token = useAuthStore.getState().token
  
  if (token) {
    config.headers = config.headers ?? {}
    config.headers.Authorization = `Bearer ${token}`
  }
  
  return config
})

// ✅ Ajoutez aussi cet intercepteur pour gérer les erreurs 401/403

api.interceptors.response.use(
  (response) => response,
  (error) => {
    const status = error?.response?.status

    // ✅ 401 = pas authentifié → logout
    if (status === 401) {
      try {
        useAuthStore.getState().logout()
      } catch {}
      if (typeof window !== 'undefined') {
        localStorage.removeItem('token')
        localStorage.removeItem('role')
        localStorage.removeItem('user')
        window.location.href = '/login'
      }
    }

    // ❌ 403 = interdit → NE PAS logout, juste remonter l’erreur
    return Promise.reject(error)
  }
)


/** ===================== TYPES ===================== */
export type BackendRole = 'ROLE_ADMIN' | 'ROLE_ENSEIGNANT' | 'ROLE_ETUDIANT'

export type UiRole = 'admin' | 'enseignant' | 'etudiant'

export type AuthResponse = { token: string; role: BackendRole }

export type Utilisateur = {
  id: number
  email: string
  nomComplet: string
  role: 'ADMIN' | 'ENSEIGNANT' | 'ETUDIANT'
  actif: boolean
  dateInscription?: string
}

/** DTO UI (pour garder vos pages telles quelles) */
export type EtudiantUI = {
  id: number
  matricule: string
  nom: string
  prenom: string
  email: string
  telephone: string
  niveau: string
  statut: 'actif' | 'inactif'
}

export type EnseignantUI = {
  id: number
  nom: string
  prenom: string
  titre: string
  email: string
  telephone: string
  matiere: string
  statut: 'actif' | 'inactif'
  coursCount: number
}


export type Semestre = { id: number; libelle?: string; nom?: string }

/** ===================== HELPERS ===================== */
export const toUiRole = (role: BackendRole | string | null | undefined): UiRole => {
  if (!role) return 'etudiant'
  if (role === 'ROLE_ADMIN') return 'admin'
  if (role === 'ROLE_ENSEIGNANT') return 'enseignant'
  return 'etudiant'
}

const splitNom = (nomComplet: string) => {
  const parts = (nomComplet || '').trim().split(/\s+/)
  if (parts.length <= 1) return { prenom: '', nom: parts[0] || '' }
  return { prenom: parts[0], nom: parts.slice(1).join(' ') }
}

/** ===================== AUTH ===================== */
export const inscription = async (payload: {
  email: string
  motDePasse: string
  nomComplet: string
  role: 'ADMIN' | 'ENSEIGNANT' | 'ETUDIANT'
}) => {
  const res = await api.post('/api/auth/inscription', payload)
  return res.data as Utilisateur
}

export const connexion = async (email: string, motDePasse: string) => {
  const res = await api.post('/api/auth/connexion', { email, motDePasse })
  return res.data as AuthResponse
}

/** ===================== ADMIN (CRUD brut /api/v1/**) ===================== */
export const getUtilisateurs = async (): Promise<Utilisateur[]> => {
  const res = await api.get('/api/v1/utilisateurs')
  return res.data
}

export const activerUtilisateur = async (id: number) => {
  const res = await api.put(`/api/v1/utilisateurs/${id}/activer`)
  return res.data as Utilisateur
}

export const desactiverUtilisateur = async (id: number) => {
  const res = await api.put(`/api/v1/utilisateurs/${id}/desactiver`)
  return res.data as Utilisateur
}

export const supprimerUtilisateur = async (id: number) => {
  await api.delete(`/api/v1/utilisateurs/${id}`)
}

/** ===================== UI ADAPTERS (utilisés par vos pages) ===================== */
export const login = async (email: string, password: string) => {
  const auth = await connexion(email, password)
  // on crée un user minimal côté UI
  return {
    token: auth.token,
    user: {
      id: 0,
      email,
      role: toUiRole(auth.role),
      nom: '',
      prenom: '',
      backendRole: auth.role,
    },
  }
}

export const getStats = async () => {
  const [users, cours] = await Promise.all([
    getUtilisateurs(),
    api.get('/api/v1/cours').then((r) => r.data as any[]).catch(() => []),
  ])

  const totalEtudiants = users.filter((u) => u.role === 'ETUDIANT').length
  const totalEnseignants = users.filter((u) => u.role === 'ENSEIGNANT').length

  return {
    totalEtudiants,
    totalEnseignants,
    totalRevenu: 0, // backend ne fournit pas de revenu pour l’instant
    totalCours: cours.length,
    nouveauxEtudiants: 0,
    tauxPresence: 0,
  }
}

export const getEtudiants = async (): Promise<EtudiantUI[]> => {
  const users = await getUtilisateurs()
  return users
    .filter((u) => u.role === 'ETUDIANT')
    .map((u) => {
      const { nom, prenom } = splitNom(u.nomComplet)
      return {
        id: u.id,
        matricule: `ETU-${u.id}`,
        nom,
        prenom,
        email: u.email,
        telephone: '',
        niveau: '',
        statut: u.actif ? 'actif' : 'inactif',
      }
    })
}

export const getEnseignants = async (): Promise<EnseignantUI[]> => {
  const users = await getUtilisateurs()
  return users
    .filter((u) => u.role === 'ENSEIGNANT')
    .map((u) => {
      const { nom, prenom } = splitNom(u.nomComplet)
      return {
        id: u.id,
        nom,
        prenom,
        titre: '',
        email: u.email,
        telephone: '',
        matiere: '',
        statut: u.actif ? 'actif' : 'inactif',
        coursCount: 0,
      }
    })
}

export type CoursBackend = {
  id: number
  titre: string
  description?: string
  semestreId: number
  enseignantId: number
  semestre?: { id: number; libelle?: string; nom?: string }
  enseignant?: { id: number; nomComplet?: string; email?: string; nom?: string; prenom?: string }
}

export const getCours = async (): Promise<CoursBackend[]> => {
  const res = await api.get('/api/v1/cours')
  return res.data
}

export const getSemestres = async (): Promise<Semestre[]> => {
  const res = await api.get('/api/v1/semestres')
  const list = res.data as any[]
  return list.map((s) => ({ id: s.id, libelle: s.libelle ?? s.nom }))
}


// ==================== Cours CRUD (backend /api/v1/cours) ====================
export const createCours = async (payload: {
  titre: string
  description?: string
  semestreId: number
  enseignantId: number
}) => {
  const res = await api.post('/api/v1/cours', payload)
  return res.data
}

export const updateCours = async (
  id: number,
  payload: {
    titre?: string
    description?: string
    semestreId?: number
    matiereId?: number
    enseignantId?: number
  }
) => {
  // on enlève les undefined pour éviter d’écraser des valeurs
  const body = Object.fromEntries(
    Object.entries(payload).filter(([_, v]) => v !== undefined && v !== null)
  )

  const res = await api.put(`/api/v1/cours/${id}`, body)
  return res.data
}


export const deleteCours = async (id: number) => {
  await api.delete(`/api/v1/cours/${id}`)
}

// ==================== FONCTIONS CRUD (adaptées au backend) ====================
export const deleteEtudiant = async (id: number) => {
  await supprimerUtilisateur(id)
  return { success: true, message: 'Étudiant supprimé avec succès' }
}

// === ENSEIGNANTS (admin) ===
export const deleteEnseignant = async (id: number) => {
  await supprimerUtilisateur(id)
  return { success: true, message: 'Enseignant supprimé avec succès' }
}

export const createEtudiant = async (data: any) => {
  // votre UI envoie souvent nom/prenom/email/motDePasse/niveau...
  const nomComplet = [data?.prenom, data?.nom].filter(Boolean).join(' ').trim() || data?.nomComplet || 'Etudiant'
  const email = data?.email
  const motDePasse = data?.motDePasse || data?.password || 'Pass1234!'
  const created = await inscription({ email, motDePasse, nomComplet, role: 'ETUDIANT' })
  return {
    success: true,
    id: created.id,
    message: 'Étudiant créé avec succès',
    data: {
      id: created.id,
      matricule: `ETU-${created.id}`,
      nom: splitNom(created.nomComplet).nom,
      prenom: splitNom(created.nomComplet).prenom,
      email: created.email,
      telephone: '',
      niveau: '',
      statut: created.actif ? 'actif' : 'inactif',
    },
  }
}

export const updateEtudiant = async (id: number, data: any) => {
  // backend ne permet pas de modifier email/nom, seulement activer/désactiver
  const statut = (data?.statut || '').toLowerCase()
  const updated =
    statut === 'inactif' || statut === 'inactive' ? await desactiverUtilisateur(id) : await activerUtilisateur(id)

  return {
    success: true,
    message: 'Statut mis à jour avec succès',
    data: {
      id: updated.id,
      matricule: `ETU-${updated.id}`,
      nom: splitNom(updated.nomComplet).nom,
      prenom: splitNom(updated.nomComplet).prenom,
      email: updated.email,
      telephone: '',
      niveau: '',
      statut: updated.actif ? 'actif' : 'inactif',
    },
  }
}

export const createEnseignant = async (data: any) => {
  const nomComplet = [data?.prenom, data?.nom].filter(Boolean).join(' ').trim() || data?.nomComplet || 'Enseignant'
  const email = data?.email
  const motDePasse = data?.motDePasse || data?.password || 'Pass1234!'
  const created = await inscription({ email, motDePasse, nomComplet, role: 'ENSEIGNANT' })
  return {
    success: true,
    id: created.id,
    message: 'Enseignant créé avec succès',
    data: {
      id: created.id,
      nom: splitNom(created.nomComplet).nom,
      prenom: splitNom(created.nomComplet).prenom,
      email: created.email,
      statut: created.actif ? 'actif' : 'inactif',
    },
  }
}

export const updateEnseignant = async (id: number, data: any) => {
  const statut = (data?.statut || '').toLowerCase()
  const updated =
    statut === 'inactif' || statut === 'inactive' ? await desactiverUtilisateur(id) : await activerUtilisateur(id)

  return {
    success: true,
    message: 'Statut mis à jour avec succès',
    data: {
      id: updated.id,
      nom: splitNom(updated.nomComplet).nom,
      prenom: splitNom(updated.nomComplet).prenom,
      email: updated.email,
      statut: updated.actif ? 'actif' : 'inactif',
    },
  }
}

export const logout = async () => {
  if (typeof window !== 'undefined') {
    localStorage.removeItem('token')
    localStorage.removeItem('user')
    localStorage.removeItem('role')
  }
}

/** ===================== ESPACES (recommandés) ===================== */
export const etudiantMesCours = async () => {
  const res = await api.get('/api/etudiants/me/cours')
  return res.data
}
export const etudiantMesNotes = async () => {
  const res = await api.get('/api/etudiants/me/notes')
  return res.data
}
export const etudiantDeposerDevoir = async (devoirId: number, urlFichier: string) => {
  const res = await api.post(`/api/etudiants/me/devoirs/${devoirId}/depots`, null, { params: { urlFichier } })
  return res.data
}

export const enseignantMesCours = async () => {
  const res = await api.get('/api/enseignants/me/cours')
  return res.data
}
export const enseignantCreerCours = async (payload: { titre: string; description?: string; semestreId: number; enseignantId: number }) => {
  const res = await api.post('/api/v1/cours', payload)
  return res.data
}

export const messagerieEnvoyerPrive = async (destinataireId: number, contenu: string) => {
  const res = await api.post('/api/messagerie/me/prive/envoyer', null, { params: { destinataireId, contenu } })
  return res.data
}
export const messagerieHistorique = async (avecUtilisateurId: number) => {
  const res = await api.get('/api/messagerie/me/prive/historique', { params: { avecUtilisateurId } })
  return res.data
}
// ==================== DEVOIRS ====================
export type Devoir = {
  id: number
  titre: string
  description?: string
  dateLimite?: string
  coursId?: number
}

export const getDevoirs = async (): Promise<Devoir[]> => {
  const res = await api.get('/api/v1/devoirs')
  return res.data
}

export const createDevoir = async (payload: any) => {
  const res = await api.post('/api/v1/devoirs', payload)
  return res.data
}

export const updateDevoir = async (id: number, payload: any) => {
  const res = await api.put(`/api/v1/devoirs/${id}`, payload)
  return res.data
}

export const deleteDevoir = async (id: number) => {
  await api.delete(`/api/v1/devoirs/${id}`)
}

// ==================== SUPPORTS DE COURS (Documents) ====================
export type SupportCours = {
  id: number
  titre: string
  description?: string
  urlFichier?: string
  coursId?: number
}


export const updateSupportCours = async (id: number, payload: any) => {
  const res = await api.put(`/api/v1/supports-cours/${id}`, payload)
  return res.data
}

// ==================== MESSAGERIE PRIVÉE (recommandé) ====================

export const getHistoriquePrive = async (avecUtilisateurId: number) => {
  const res = await api.get(`/api/messagerie/me/prive/historique`, {
    params: { avecUtilisateurId },
  })
  return res.data
}

export const envoyerMessagePrive = async (destinataireId: number, contenu: string) => {
  const res = await api.post(`/api/messagerie/me/prive/envoyer`, null, {
    params: { destinataireId, contenu },
  })
  return res.data
}

// ==================== DISCUSSIONS (CRUD brut /api/v1) ====================

export const getDiscussions = async () => {
  const res = await api.get('/api/v1/discussions')
  return res.data
}

// Selon ton backend, ça peut être filtrable par query param ou pas.
// Ici on tente avec param discussionId, sinon ton backend renverra tout.
export const getMessagesDiscussion = async (discussionId: number) => {
  const res = await api.get('/api/v1/messages-discussion', {
    params: { discussionId },
  })
  // si backend renvoie tout, tu peux filtrer côté front au besoin
  const data = res.data
  if (Array.isArray(data)) {
    return data.filter((m: any) => m.discussionId === discussionId)
  }
  return data
}

export const envoyerMessageDiscussion = async (discussionId: number, contenu: string) => {
  const res = await api.post('/api/v1/messages-discussion', {
    discussionId,
    contenu,
  })
  return res.data
}
// ==================== NOTIFICATIONS ====================

export type Notification = {
  id: number
  titre?: string
  message?: string
  contenu?: string
  lu?: boolean
  dateCreation?: string
}

/**
 * Récupérer les notifications selon le rôle
 */
export const getNotifications = async (
  role: 'admin' | 'enseignant' | 'etudiant',
  utilisateurId?: number
): Promise<Notification[]> => {
  let url = ''

  if (role === 'admin') {
    url = '/api/v1/notifications'
  } else {
    if (!utilisateurId) return []
    url = `/api/notifications/${utilisateurId}`
  }

  const res = await api.get(url)
  return Array.isArray(res.data) ? res.data : []
}

/**
 * Marquer une notification comme lue
 */
export const markNotificationAsRead = async (notificationId: number) => {
  const res = await api.post(`/api/notifications/${notificationId}/lue`)
  return res.data
}

// ==================== ENSEIGNANT (MES COURS) ====================

export type BackendSemestre = {
  id: number
  // le backend peut renvoyer "code" OU autre (libelle/nom)
  code?: string
  libelle?: string
  nom?: string
  description?: string
}

export type BackendMatiere = { id: number; libelle: string }

export type BackendCours = {
  id: number
  titre: string
  description?: string
  semestre?: BackendSemestre | null
  matiere?: BackendMatiere | null
  dateCreation?: string
}

export const enseignantGetMyCours = async (): Promise<BackendCours[]> => {
  const res = await api.get('/api/enseignants/me/cours')
  return Array.isArray(res.data) ? res.data : []
}

/**
 * Le backend attend une entité Cours :
 * { titre, description, semestre:{id}, matiere:{id} }
 * (enseignant est injecté côté backend via l'utilisateur connecté)
 */
export const enseignantCreateMyCours = async (payload: {
  titre: string
  description?: string
  semestreId?: number
  matiereId?: number
}): Promise<BackendCours> => {
  const body: any = {
    titre: payload.titre,
    description: payload.description ?? '',
  }

  if (payload.semestreId) body.semestre = { id: payload.semestreId }
  if (payload.matiereId) body.matiere = { id: payload.matiereId }

  const res = await api.post('/api/enseignants/me/cours', body)
  return res.data
}

// ==================== LISTES UTILES POUR FORMULAIRE (ADMIN CRUD) ====================



export const getMatieres = async (): Promise<BackendMatiere[]> => {
  const res = await api.get('/api/v1/matieres')
  return Array.isArray(res.data) ? res.data : []
}

// ==================== SUPPORTS DE COURS (RESSOURCES) ====================

export type BackendSupportCours = {
  id: number
  titre?: string
  nomFichier?: string
  urlFichier?: string
  version?: number
  type?: string
  cours?: { id: number } | null
  coursId?: number
}

export const getSupportsCours = async (): Promise<BackendSupportCours[]> => {
  const res = await api.get('/api/v1/supports-cours')
  return Array.isArray(res.data) ? res.data : []
}

export const createSupportCours = async (payload: {
  coursId: number
  nomFichier: string
  urlFichier: string
  type?: string // selon ton enum backend TypeSupport
  version?: number
}): Promise<BackendSupportCours> => {
  const res = await api.post('/api/v1/supports-cours', {
    coursId: payload.coursId,
    nomFichier: payload.nomFichier,
    // compat backend (titre mappé sur nomFichier) si nécessaire :
    titre: payload.nomFichier,
    urlFichier: payload.urlFichier,
    type: payload.type,
    version: payload.version ?? 1,
  })
  return res.data
}

export const deleteSupportCours = async (id: number) => {
  const res = await api.delete(`/api/v1/supports-cours/${id}`)
  return res.data
}

// ==================== ENSEIGNANT : DEVOIRS ====================
// Endpoints : /api/enseignants/me/**

export type BackendDevoir = {
  id: number
  titre?: string
  description?: string
  dateLimite?: string
  cours?: { id: number; titre?: string }
}

export const enseignantGetMyDevoirs = async (coursId?: number): Promise<BackendDevoir[]> => {
  const url = coursId
    ? `/api/enseignants/me/cours/${coursId}/devoirs`
    : `/api/enseignants/me/devoirs`
  const res = await api.get(url)
  return Array.isArray(res.data) ? res.data : []
}

export const enseignantCreateDevoir = async (
  coursId: number,
  payload: { titre: string; description?: string | null; dateLimite?: string | null }
): Promise<BackendDevoir> => {
  const res = await api.post(`/api/enseignants/me/cours/${coursId}/devoirs`, payload)
  return res.data
}

export const enseignantUpdateDevoir = async (
  id: number,
  payload: { titre?: string; description?: string | null; dateLimite?: string | null }
): Promise<BackendDevoir> => {
  const res = await api.put(`/api/enseignants/me/devoirs/${id}`, payload)
  return res.data
}

export const enseignantDeleteDevoir = async (id: number) => {
  await api.delete(`/api/enseignants/me/devoirs/${id}`)
}

// ==================== ÉTUDIANT (ME) ====================

export type EtudiantCours = {
  id: number
  titre?: string
  description?: string
  matiere?: string
  module?: string
  semestre?: string
  enseignant?: string
}

export type EtudiantNote = {
  depotId: number
  note: number
  commentaire?: string
  devoirTitre?: string
}

export type EtudiantDevoir = {
  id: number
  titre: string
  consigne?: string
  dateLimite?: string
  cours?: { id: number; titre?: string }
}

export type EtudiantSupport = {
  id: number
  type: string
  nomFichier: string
  urlFichier: string
  version: number
  dateUpload: string
  coursId?: number
}

export type Discussion = {
  id: number
  sujet?: string
  dateCreation?: string
  cours?: { id: number; titre?: string }
}

export const getEtudiantMesCours = async () => {
  const res = await api.get('/api/etudiants/me/cours')
  return Array.isArray(res.data) ? res.data : []
}

export const getEtudiantMesNotes = async () => {
  const res = await api.get('/api/etudiants/me/notes')
  return Array.isArray(res.data) ? res.data : []
}

export const getEtudiantMesDevoirs = async () => {
  const res = await api.get('/api/etudiants/me/devoirs')
  return Array.isArray(res.data) ? res.data : []
}

export const getEtudiantMesSupports = async () => {
  const res = await api.get('/api/etudiants/me/supports-cours')
  return Array.isArray(res.data) ? res.data : []
}

export const getEtudiantMesDiscussions = async () => {
  const res = await api.get('/api/etudiants/me/discussions')
  return Array.isArray(res.data) ? res.data : []
}

export const deposerDevoirEtudiant = async (devoirId: number, urlFichier: string) => {
  const res = await api.post(`/api/etudiants/me/devoirs/${devoirId}/depots`, null, {
    params: { urlFichier },
  })
  return res.data
}

// ==================== MESSAGERIE (discussions) ====================
// ✅ On utilise le contrôleur /api/messagerie (pas /api/v1)

export const getMessagesDiscussionV2 = async (discussionId: number) => {
  const res = await api.get(`/api/messagerie/discussions/${discussionId}/messages`)
  return Array.isArray(res.data) ? res.data : []
}

export const envoyerMessageDiscussionV2 = async (discussionId: number, auteurId: number, contenu: string) => {
  const res = await api.post(`/api/messagerie/discussions/${discussionId}/messages`, null, {
    params: { auteurId, contenu },
  })
  return res.data
}
// ==================== ADMIN : SEMESTRES / MODULES / MATIERES ====================

export type AdminSemestre = { id: number; code?: string; description?: string; libelle?: string; nom?: string }
export type AdminModule = { id: number; code: string; libelle: string }
export type AdminMatiere = { id: number; libelle: string; module?: { id: number; code?: string; libelle?: string } }

// ✅ CREATE semestre (backend attend: { code, description })
export const createSemestre = async (payload: { code: string; description?: string }) => {
  const res = await api.post('/api/v1/semestres', payload)
  return res.data
}

// ✅ LIST modules
export const getModules = async (): Promise<AdminModule[]> => {
  const res = await api.get('/api/v1/modules')
  return Array.isArray(res.data) ? res.data : []
}

// ✅ CREATE module (backend attend: { code, libelle })
export const createModule = async (payload: { code: string; libelle: string }) => {
  const res = await api.post('/api/v1/modules', payload)
  return res.data
}

// ✅ CREATE matière (backend attend: { libelle, moduleId })
export const createMatiere = async (payload: { libelle: string; moduleId?: number | null }) => {
  const body: any = { libelle: payload.libelle }
  if (payload.moduleId !== undefined) body.moduleId = payload.moduleId
  const res = await api.post('/api/v1/matieres', body)
  return res.data
}


export default api