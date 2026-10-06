# Spec 05: Filtros Especializados para Red Team, Linux/Bajo Nivel y DevSecOps

## 1. Propósito y Contexto
Esta especificación define la incorporación de **perfiles de filtrado rápido y temáticas especializadas** orientadas al perfil técnico del usuario:
1. **🐧 Linux, Sistemas Operativos y Bajo Nivel:** Pasión por el arte del hacking a nivel sistema, kernel, reversing, firmware, hardware y manipulación de memoria.
2. **🎯 Red Team y Exploit Writing:** Técnicas ofensivas avanzadas, evasión de defensas (EDR bypass), weaponization, active directory y explotación aplicada.
3. **🛡️ DevSecOps y Seguridad Cloud:** Ámbito profesional enfocado en pipelines de CI/CD, AppSec, DevSecOps, AWS/Cloud posture y gobierno de agentes/IA.

---

## 2. Inventario y Mapeo de Charlas en Ekoparty 2026

A partir del dataset de 68 charlas de [`src/data/raw-sessions.ts`](../../src/data/raw-sessions.ts), se identifican las sesiones correspondientes a cada nicho:

### 2.1 Eje 1: Linux, Sistemas Operativos y Bajo Nivel (`linux_lowlevel`)
- **Miércoles 7:**
  - `7-M-1005`: *Zero-Knowledge cracking of a 1983 Apple II Hardware Copy Protection* (Inbar Raz).
  - `7-M-1710`: *Every ride you take - Hacking a City’s Public Transportation* (Ignacio Navarro).
  - `7-C2-1115`: *Quantum Gadgets: Finding Optimal ROP Chains on Real Quantum Computer Hardware* (Carlos Benitez).
- **Jueves 8:**
  - `8-M-1140`: *VU#226679: rompiendo contraseñas UEFI mediante WinRE* (Beatriz Fresno Naumova).
  - `8-M-1210`: *Reversing el DRM de Netflix: anatomía de Widevine L1 en Windows* (Jeremy Erazo).
  - `8-M-1440`: *Breaking the Warehouse: From Bluetooth Devices to Operational Control* (Sergey Sidorov | Haidar Kabibo).
  - `8-M-1530`: *It's a me! DOOM! A Homebrew Entry Point for LEGO Super Mario* (Kevin Aguilar - cabr4).
  - `8-M-1620`: *Hardware in the loop: reverseando el link de un headset de VR* (Matias Sebastian Soler).
  - `8-M-1710`: *Hacking the KIA Real Time Operative System* (Danilo Erazo).
  - `8-C3-1445`: *Escapando de una Restricted Shell a los golpes: MIPS, Syscalls y Kernel Panics* (Matias Ramirez).
- **Viernes 9:**
  - `9-M-0950`: *Contactless Under Attack: PIN Bypass, EMV and Apple Pay* (Davi Mikael).
  - `9-M-1530`: *Root From Kilometers Away: Ubiquiti…*
  - `9-C2-1115`: *Call of Control: From Phone Call to Scooter Takeover* (Omkar Mali).
  - `9-D-1445`: *Firmware Analysis 101: Lo que debes saber antes y después de abrir un binario* (Mario Sebastián Micucci).
  - `9-C2-1530`: *Inside the Hardwa… Introducción en CTFs* (Erick Maldonado | Paola Gerig).

---

### 2.2 Eje 2: Red Team y Exploit Writing (`redteam_exploit`)
- **Miércoles 7:**
  - `7-M-0925`: *LATAM-as-a-Service: How Latin American cybercrime industrialized Everything-as-a-Service* (Anton Dolgalev).
  - `7-M-1055`: *MSIX'd Up: Weaponizing the Modern Windows App Packaging Ecosystem* (Nick Powers).
  - `7-M-1440`: *¡Atrápalos Ya! How To Capture 3.5 Billion WhatsApp Accounts* (Gabriel Gegenhuber | Max Guenther | Philipp Frenzel).
  - `7-M-1530`: *Prompt Critical: AI-driven Weaponization of a UniFi OS RCE Chain*.
  - `7-M-1620`: *Dead.Letter y el exploit writing moderno* (Andrés Luksenberg).
  - `7-D-0945`: *From Tickets to Tokens: Weaponizing the Hybrid Identity Boundary with SATO* (Edrian Miranda).
  - `7-D-1200`: *“Hey Red Teamer, I’ve Got a Human EDR…*
- **Jueves 8:**
  - `8-D-1400`: *CTF de Ingeniería Social*.
  - `8-C1-0945`: *Hackeando las Herramientas del Agente: Pentesting de Servidores MCP en el Mundo Real* (Luis Diego Raga).
  - `8-C1-1700`: *N-days Weaponizer with a Multi-Agent AI Pipeline* (Andrea Brosio).
  - `8-C2-1400`: *iOS Game Hacking: From Zero to God Mode* (Luis De la Rosa | Steeven Rodríguez).
  - `8-C3-1700`: *CRYPT - STEG DIA 2: Breaking ECC with Short…* (Agustin Isoldi | German Bollmann).
- **Viernes 9:**
  - `9-M-1020`: *Living Off Trusted Cloud: Provider Infrastructure as Phishing Delivery Channel* (Rahul Vashisht).
  - `9-M-1250`: *HTTP2Crash and the Cicada Problem* (Houston Hunt).
  - `9-M-1440`: *The Glass Perimeter - Systematic Bypasses in Biometric Frameworks and the Rise of Synthetic Identity* (Dan Borgogno | Javier Bernardo).
  - `9-D-1400`: *XSS Weaponization: Advanced Techniques for Browser Exploitation on Red Team Operation* (Jessica Rampin).
  - `9-C2-1030`: *Agentes Ofensivos (Hackbo…* (Camila Casas).
  - `9-C2-1445`: *Explotando la lógica de Active Directory: Una revisión de CVEs críticos* (Erick Maldonado | Hugo Rodrigo Rivas Galindo).

---

### 2.3 Eje 3: DevSecOps y Seguridad Cloud (`devsecops_cloud`)
- **Miércoles 7:**
  - `7-C1-1530`: *De Honeypot a Pipeline de Detección: integrando Zeek y Machine Learning*.
  - `7-C2-1030`: *PCI-DSS real en arquitecturas AWS: Cumplir sin morir en el intento*.
  - `7-C2-1400`: *Hackers, reguladores y ejecutivos: sobrevivir a la gobernanza*.
- **Jueves 8:**
  - `8-C2-1115`: *Zero Trust for AI Ops: Securing LLMs, RAG, and Agents* (Emilio Oropeza).
  - `8-C2-1445`: *AI Driven Development* (Axel Labruna).
  - `8-C2-1615`: *Gobierno del uso de IA en la Nube*.
  - `8-C3-1200`: *Un agente de IA para triage que aprendió a decir "no sé"* (Matias Federico Manassero).
- **Viernes 9:**
  - `9-M-1200`: *A Practical Approach to Post-Quantum Readiness at Scale!* (Sheila Berta).
  - `9-D-0900`: *Logs Under Fire* (Valentin Torassa Colombero).
  - `9-C1-0945`: *Prompt injection en agentes con tools: permisos, aislamiento y auditoría* (Valentín Torassa Colombero).
  - `9-C2-0900`: *Código roto, plata viva: de las buenas prácticas OWASP al código seguro*.
  - `9-C2-0945`: *A fondo con IA: DevSecOps en el Gran Premio del AppSec SDLC* (Matias Ferreira).
  - `9-C2-1400`: *Dónde nos equivocamos en el prompt injection* (Matias Armándola).

---

## 3. Modelo de Datos y Tipos TypeScript

### 3.1 Nuevos Identificadores de Perfil / Tracks Especiales
```typescript
export type SpecialTrackId = 'linux_lowlevel' | 'redteam_exploit' | 'devsecops_cloud';

export interface SpecialTrackInfo {
  id: SpecialTrackId;
  label: string;       // Ej: '🐧 Linux & Bajo Nivel'
  shortLabel: string;  // Ej: 'Linux & HW'
  badge: string;       // Ej: 'Bajo Nivel'
  description: string;
}
```

### 3.2 Registro de Metadatos (`src/data/special-tracks.ts`)
```typescript
export const SPECIAL_TRACKS: Record<SpecialTrackId, SpecialTrackInfo> = {
  linux_lowlevel: {
    id: 'linux_lowlevel',
    label: '🐧 Linux & Bajo Nivel',
    shortLabel: 'Linux / Kernel',
    badge: 'Kernel & HW',
    description: 'Kernel, syscalls, UEFI, reversing, hardware hacking y firmware.',
  },
  redteam_exploit: {
    id: 'redteam_exploit',
    label: '🎯 Red Team & Exploits',
    shortLabel: 'Red Team',
    badge: 'Ofensiva',
    description: 'Exploit writing, weaponization, EDR bypass, Active Directory y ofensiva.',
  },
  devsecops_cloud: {
    id: 'devsecops_cloud',
    label: '🛡️ DevSecOps & Cloud',
    shortLabel: 'DevSecOps',
    badge: 'AppSec / Cloud',
    description: 'CI/CD pipelines, AppSec SDLC, AWS, Zero Trust y gobierno de IA.',
  },
};
```

---

## 4. Diseño de Interfaz y Filtros Rápidos (UI / UX)

1. **Selector de Tracks Especiales en Toolbar:**
   - Ubicado encima de los chips de salas y temáticas como una fila destacada de **"Modo / Foco"**:
     `[ Todos ]` `[ 🎯 Red Team ]` `[ 🐧 Linux & Bajo Nivel ]` `[ 🛡️ DevSecOps ]`
   - Funcionamiento:
     - Actúa como un macro-filtro toggle o preset.
     - Al activarse, filtra instantáneamente la vista (Grilla, Lista o Mi Agenda) destacando únicamente las sesiones que integran el track.
     - Es combinable con la búsqueda por texto y con el conmutador "Solo en español".
2. **Badges en las Tarjetas:**
   - En la vista Grilla y Lista, las charlas que pertenezcan a estos tracks exhibirán un pequeño badge distinguible (`tag` mono) para identificarlas visualmente al escanear la agenda.

---

## 5. Criterios de Aceptación
1. Al hacer clic en "🐧 Linux & Bajo Nivel", la Grilla atenúa todas las charlas ajenas y destaca las 15 sesiones de kernel, reversing, hardware y firmware.
2. Al hacer clic en "🎯 Red Team", se filtran las 18 sesiones ofensivas y de weaponization.
3. Al hacer clic en "🛡️ DevSecOps", se filtran las 12 sesiones de AppSec, pipelines y cloud defense.
4. Total persistencia y compatibilidad con el sistema de favoritos y la vista móvil.
