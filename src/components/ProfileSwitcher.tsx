import { ArrowClockwise, DownloadSimple, PencilSimple, Plus, Trash, UploadSimple, Users } from "@phosphor-icons/react";
import { useEffect, useMemo, useRef, useState } from "react";
import type { LocalProfile } from "../types";

interface ProfileSwitcherProps {
  activeProfile: LocalProfile;
  profiles: LocalProfile[];
  onSwitch: (profileId: string) => void;
  onCreate: (name: string) => void;
  onRename: (profileId: string, name: string) => void;
  onReset: (profileId: string) => void;
  onDelete: (profileId: string) => void;
  onExportCurrent: () => void;
  onExportAll: () => void;
  onImportBackup: (file: File) => Promise<void> | void;
}

export function ProfileSwitcher({
  activeProfile,
  profiles,
  onSwitch,
  onCreate,
  onRename,
  onReset,
  onDelete,
  onExportCurrent,
  onExportAll,
  onImportBackup,
}: ProfileSwitcherProps) {
  const fileInputRef = useRef<HTMLInputElement | null>(null);
  const [createName, setCreateName] = useState("");
  const [renameName, setRenameName] = useState(activeProfile.name);

  const profileCountLabel = useMemo(
    () => `${profiles.length} ${profiles.length === 1 ? "profiel" : "profielen"}`,
    [profiles.length],
  );

  useEffect(() => {
    setRenameName(activeProfile.name);
  }, [activeProfile.name]);

  return (
    <details className="profile-switcher">
      <summary>
        <span className="profile-pill">
          <span className="profile-avatar" style={{ backgroundColor: activeProfile.color }}>
            {activeProfile.name.slice(0, 1).toUpperCase()}
          </span>
          <span className="profile-pill-copy">
            <strong>{activeProfile.name}</strong>
            <small>Lokale profielen</small>
          </span>
        </span>
      </summary>

      <div className="profile-menu">
        <div className="profile-menu-head">
          <div>
            <span className="section-kicker">Profielen</span>
            <h3>{profileCountLabel}</h3>
          </div>
          <Users size={20} />
        </div>

        <p className="profile-storage-note">Je voortgang wordt lokaal opgeslagen op dit apparaat.</p>

        <div className="profile-list" role="list">
          {profiles.map((profile) => (
            <button
              key={profile.id}
              className={`profile-row ${profile.id === activeProfile.id ? "is-active" : ""}`}
              onClick={() => {
                setRenameName(profile.name);
                onSwitch(profile.id);
              }}
            >
              <span className="profile-avatar" style={{ backgroundColor: profile.color }}>
                {profile.name.slice(0, 1).toUpperCase()}
              </span>
              <span>
                <strong>{profile.name}</strong>
                <small>{profile.progress.answers.length} vragen gemaakt</small>
              </span>
            </button>
          ))}
        </div>

        <div className="profile-form-row">
          <label htmlFor="new-profile-name">Nieuw profiel</label>
          <div className="profile-inline-form">
            <input
              id="new-profile-name"
              value={createName}
              onChange={(event) => setCreateName(event.target.value)}
              placeholder="Bijv. Oweis"
            />
            <button
              className="secondary-button"
              onClick={() => {
                if (!createName.trim()) return;
                onCreate(createName);
                setCreateName("");
              }}
            >
              <Plus size={16} />
              Maken
            </button>
          </div>
        </div>

        <div className="profile-form-row">
          <label htmlFor="rename-profile-name">Actief profiel hernoemen</label>
          <div className="profile-inline-form">
            <input
              id="rename-profile-name"
              value={renameName}
              onChange={(event) => setRenameName(event.target.value)}
            />
            <button className="ghost-button" onClick={() => onRename(activeProfile.id, renameName)}>
              <PencilSimple size={16} />
              Opslaan
            </button>
          </div>
        </div>

        <div className="profile-action-grid">
          <button className="ghost-button" onClick={onExportCurrent}>
            <DownloadSimple size={16} />
            Exporteer actief
          </button>
          <button className="ghost-button" onClick={onExportAll}>
            <DownloadSimple size={16} />
            Exporteer alles
          </button>
          <button className="ghost-button" onClick={() => fileInputRef.current?.click()}>
            <UploadSimple size={16} />
            Importeer backup
          </button>
          <button className="ghost-button" onClick={() => onReset(activeProfile.id)}>
            <ArrowClockwise size={16} />
            Reset profiel
          </button>
          <button className="review-button" disabled={profiles.length <= 1} onClick={() => onDelete(activeProfile.id)}>
            <Trash size={16} />
            Verwijder profiel
          </button>
        </div>

        <input
          ref={fileInputRef}
          type="file"
          accept="application/json"
          hidden
          onChange={async (event) => {
            const file = event.target.files?.[0];
            if (file) await onImportBackup(file);
            event.target.value = "";
          }}
        />
      </div>
    </details>
  );
}
