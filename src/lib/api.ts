import axios from 'axios'

const API_URL = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:8000/api'

const api = axios.create({
  baseURL: API_URL,
  headers: {
    'Content-Type': 'application/json',
  },
})

// Intercepteur pour ajouter le token
api.interceptors.request.use(
  (config) => {
    if (typeof window !== 'undefined') {
      const token = localStorage.getItem('token')
      if (token) {
        config.headers.Authorization = `Bearer ${token}`
      }
    }
    return config
  },
  (error) => {
    return Promise.reject(error)
  }
)

// ==================== FONCTIONS D'AUTHENTIFICATION ====================
export const login = async (email: string, password: string) => {
  // Simulation pour développement
  const mockUsers = {
    'admin@mastercampus.com': { role: 'admin', nom: 'Admin', prenom: 'Système' },
    'etudiant@mastercampus.com': { role: 'etudiant', nom: 'Étudiant', prenom: 'Test' },
    'enseignant@mastercampus.com': { role: 'enseignant', nom: 'Enseignant', prenom: 'Test' },
  };

  await new Promise(resolve => setTimeout(resolve, 1000));

  const user = mockUsers[email as keyof typeof mockUsers];
  
  if (user && password === 'password123') {
    return {
      token: 'fake-jwt-token-for-development',
      user: {
        id: 1,
        email: email,
        ...user
      }
    };
  }

  throw new Error('Email ou mot de passe incorrect');
};

// ==================== FONCTIONS DE DONNÉES ====================
export const getStats = async () => {
  await new Promise(resolve => setTimeout(resolve, 500));
  
  return {
    totalEtudiants: 250,
    totalEnseignants: 35,
    totalRevenu: 12500000,
    totalCours: 48,
    nouveauxEtudiants: 12,
    tauxPresence: 85
  };
};

export const getEtudiants = async () => {
  await new Promise(resolve => setTimeout(resolve, 500));
  
  return [
    { id: 1, matricule: 'ETU2024001', nom: 'Diallo', prenom: 'Amadou', email: 'amadou@email.com', telephone: '771234567', niveau: 'L1', statut: 'actif' },
    { id: 2, matricule: 'ETU2024002', nom: 'Ndiaye', prenom: 'Fatou', email: 'fatou@email.com', telephone: '771234568', niveau: 'L2', statut: 'actif' },
    { id: 3, matricule: 'ETU2024003', nom: 'Sow', prenom: 'Moussa', email: 'moussa@email.com', telephone: '771234569', niveau: 'L3', statut: 'actif' },
    { id: 4, matricule: 'ETU2024004', nom: 'Fall', prenom: 'Aïcha', email: 'aicha@email.com', telephone: '771234570', niveau: 'M1', statut: 'actif' },
    { id: 5, matricule: 'ETU2024005', nom: 'Ba', prenom: 'Ibrahima', email: 'ibrahima@email.com', telephone: '771234571', niveau: 'M2', statut: 'actif' },
  ];
};

export const getEnseignants = async () => {
  await new Promise(resolve => setTimeout(resolve, 500));
  
  return [
    { id: 1, nom: 'Diallo', prenom: 'Amadou', titre: 'Dr', email: 'prof.diallo@email.com', telephone: '771234570', matiere: 'Mathématiques', statut: 'actif', coursCount: 4 },
    { id: 2, nom: 'Ndiaye', prenom: 'Fatou', titre: 'Prof', email: 'prof.ndiaye@email.com', telephone: '771234571', matiere: 'Informatique', statut: 'actif', coursCount: 3 },
    { id: 3, nom: 'Sow', prenom: 'Moussa', titre: 'Dr', email: 'prof.sow@email.com', telephone: '771234572', matiere: 'Physique', statut: 'actif', coursCount: 2 },
    { id: 4, nom: 'Fall', prenom: 'Aïcha', titre: 'Prof', email: 'prof.fall@email.com', telephone: '771234573', matiere: 'Chimie', statut: 'actif', coursCount: 3 },
  ];
};

export const getCours = async () => {
  await new Promise(resolve => setTimeout(resolve, 500));
  
  return [
    { 
      id: 1, 
      code: 'MATH101', 
      titre: 'Mathématiques Avancées', 
      niveau: 'L1', 
      enseignant: 'Dr. Diallo', 
      etudiantsInscrits: 45, 
      heures: 48, 
      semestre: 'S1', 
      credits: 4, 
      statut: 'actif', 
      description: 'Cours de mathématiques avancées couvrant les concepts fondamentaux' 
    },
    { 
      id: 2, 
      code: 'INF202', 
      titre: 'Algorithmique', 
      niveau: 'L2', 
      enseignant: 'Prof. Ndiaye', 
      etudiantsInscrits: 40, 
      heures: 42, 
      semestre: 'S2', 
      credits: 3, 
      statut: 'actif', 
      description: 'Introduction aux algorithmes et structures de données' 
    },
    { 
      id: 3, 
      code: 'PHY301', 
      titre: 'Physique Quantique', 
      niveau: 'L3', 
      enseignant: 'Dr. Sow', 
      etudiantsInscrits: 35, 
      heures: 36, 
      semestre: 'S3', 
      credits: 4, 
      statut: 'actif', 
      description: 'Introduction à la physique quantique' 
    },
    { 
      id: 4, 
      code: 'CHM401', 
      titre: 'Chimie Organique', 
      niveau: 'M1', 
      enseignant: 'Prof. Fall', 
      etudiantsInscrits: 30, 
      heures: 40, 
      semestre: 'S4', 
      credits: 3, 
      statut: 'actif', 
      description: 'Chimie organique avancée' 
    },
  ];
};

// ==================== FONCTIONS CRUD ====================
export const deleteEtudiant = async (id: number) => {
  await new Promise(resolve => setTimeout(resolve, 500));
  console.log(`Étudiant ${id} supprimé (simulation)`);
  return { success: true, message: 'Étudiant supprimé avec succès' };
};

export const createEtudiant = async (data: any) => {
  await new Promise(resolve => setTimeout(resolve, 500));
  console.log('Étudiant créé (simulation):', data);
  return { 
    success: true, 
    id: Date.now(),
    message: 'Étudiant créé avec succès',
    data: { ...data, id: Date.now(), matricule: `ETU${Date.now().toString().slice(-6)}` }
  };
};

export const updateEtudiant = async (id: number, data: any) => {
  await new Promise(resolve => setTimeout(resolve, 500));
  console.log(`Étudiant ${id} mis à jour (simulation):`, data);
  return { 
    success: true, 
    message: 'Étudiant mis à jour avec succès',
    data: { ...data, id }
  };
};

export const logout = async () => {
  if (typeof window !== 'undefined') {
    localStorage.removeItem('token');
    localStorage.removeItem('user');
  }
};
// Ajoutez ces fonctions à votre fichier api.ts existant

export const createCours = async (data: any) => {
  await new Promise(resolve => setTimeout(resolve, 500));
  console.log('Cours créé (simulation):', data);
  return { 
    success: true, 
    id: Date.now(),
    message: 'Cours créé avec succès',
    data: { ...data, id: Date.now(), etudiantsInscrits: 0 }
  };
};

export const updateCours = async (id: number, data: any) => {
  await new Promise(resolve => setTimeout(resolve, 500));
  console.log(`Cours ${id} mis à jour (simulation):`, data);
  return { 
    success: true, 
    message: 'Cours mis à jour avec succès',
    data: { ...data, id }
  };
};

export const deleteCours = async (id: number) => {
  await new Promise(resolve => setTimeout(resolve, 500));
  console.log(`Cours ${id} supprimé (simulation)`);
  return { success: true, message: 'Cours supprimé avec succès' };
};
export default api;


// import axios from 'axios'

// const API_URL = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:8000/api'

// const api = axios.create({
//   baseURL: API_URL,
//   headers: {
//     'Content-Type': 'application/json',
//   },
// })

// // Intercepteur pour ajouter le token
// api.interceptors.request.use(
//   (config) => {
//     if (typeof window !== 'undefined') {
//       const token = localStorage.getItem('token')
//       if (token) {
//         config.headers.Authorization = `Bearer ${token}`
//       }
//     }
//     return config
//   },
//   (error) => {
//     return Promise.reject(error)
//   }
// )

// // API calls
// export const login = async (email: string, password: string) => {
//   const response = await api.post('/auth/login', { email, password })
//   return response.data
// }

// export const getStats = async () => {
//   const response = await api.get('/stats')
//   return response.data
// }

// export const getEtudiants = async () => {
//   const response = await api.get('/etudiants')
//   return response.data
// }

// export const getEnseignants = async () => {
//   const response = await api.get('/enseignants')
//   return response.data
// }

// export const getCours = async () => {
//   const response = await api.get('/cours')
//   return response.data
// }

// export const deleteEtudiant = async (id: number) => {
//   const response = await api.delete(`/etudiants/${id}`)
//   return response.data
// }

// export const createEtudiant = async (data: any) => {
//   const response = await api.post('/etudiants', data)
//   return response.data
// }

// export const updateEtudiant = async (id: number, data: any) => {
//   const response = await api.put(`/etudiants/${id}`, data)
//   return response.data
// }

// export const logout = async () => {
//   localStorage.removeItem('token')
//   localStorage.removeItem('user')
// }

// export default api