export type SpecialTrackId = 'linux_lowlevel' | 'redteam_exploit' | 'devsecops_cloud';

export interface SpecialTrackInfo {
  id: SpecialTrackId;
  label: string;
  shortLabel: string;
  badge: string;
  accentColor: string;
  description: string;
  sessionIds: Set<string>;
}

export const SPECIAL_TRACKS: Record<SpecialTrackId, SpecialTrackInfo> = {
  linux_lowlevel: {
    id: 'linux_lowlevel',
    label: 'Linux & Bajo Nivel',
    shortLabel: 'Linux / Kernel',
    badge: 'Linux / HW',
    accentColor: '#14A57F',
    description: 'Kernel, syscalls, UEFI, reversing, hardware hacking y firmware.',
    sessionIds: new Set([
      '7-M-1005',
      '7-M-1710',
      '7-C2-1115',
      '8-M-1140',
      '8-M-1210',
      '8-M-1440',
      '8-M-1530',
      '8-M-1620',
      '8-M-1710',
      '8-C3-1445',
      '9-M-0950',
      '9-M-1530',
      '9-C2-1115',
      '9-D-1445',
      '9-C2-1530',
    ]),
  },
  redteam_exploit: {
    id: 'redteam_exploit',
    label: 'Red Team & Exploits',
    shortLabel: 'Red Team',
    badge: 'Red Team',
    accentColor: '#F2542D',
    description: 'Exploit writing, weaponization, EDR bypass, Active Directory y ofensiva.',
    sessionIds: new Set([
      '7-M-0925',
      '7-M-1055',
      '7-M-1440',
      '7-M-1530',
      '7-M-1620',
      '7-D-0945',
      '7-D-1200',
      '8-D-1400',
      '8-C1-0945',
      '8-C1-1700',
      '8-C2-1400',
      '8-C3-1700',
      '9-M-1020',
      '9-M-1250',
      '9-M-1440',
      '9-D-1400',
      '9-C2-1030',
      '9-C2-1445',
    ]),
  },
  devsecops_cloud: {
    id: 'devsecops_cloud',
    label: 'DevSecOps & Cloud',
    shortLabel: 'DevSecOps',
    badge: 'DevSecOps',
    accentColor: '#2F80F5',
    description: 'CI/CD pipelines, AppSec SDLC, AWS, Zero Trust y defensa cloud.',
    sessionIds: new Set([
      '7-C1-1530',
      '7-C2-1030',
      '7-C2-1400',
      '8-C2-1115',
      '8-C2-1445',
      '8-C2-1615',
      '8-C3-1200',
      '9-M-1200',
      '9-D-0900',
      '9-C1-0945',
      '9-C2-0900',
      '9-C2-0945',
      '9-C2-1400',
    ]),
  },
};

export const SPECIAL_TRACK_LIST = Object.values(SPECIAL_TRACKS);

export function getSessionSpecialTracks(sessionId: string): SpecialTrackInfo[] {
  return SPECIAL_TRACK_LIST.filter((track) => track.sessionIds.has(sessionId));
}

export function isSessionInSpecialTrack(
  sessionId: string,
  trackId: SpecialTrackId
): boolean {
  return SPECIAL_TRACKS[trackId]?.sessionIds.has(sessionId) ?? false;
}
