'use client';

import { useEffect, useState } from 'react';
import Image from 'next/image';
import HelloAnimation from '../components/HelloAnimation';

interface AppConfig {
  name: string;
  link: string;
  folder: string;
}

const appBaseFolders = [
  "1password", "alcove", "amie", "arc_browser", "chatgpt", "cleanshot_x", "cursor",
  "daylight_desktop", "developer_(apple)", "discord", "focusrite_control_2", "ghostty",
  "github_desktop", "homerow", "klack", "linear", "raycast", "rectangle", "sf_symbols",
  "slack", "superhuman", "superwhisper", "telegram", "testflight", "xcode",
  "yubico_authenticator", "zoom",
];

export default function HomePage() {
  const [apps, setApps] = useState<AppConfig[]>([]);
  const [searchTerm, setSearchTerm] = useState('');
  const [isLoading, setIsLoading] = useState(true);
  const [showPanel, setShowPanel] = useState(false);
  const [panelApp, setPanelApp] = useState<AppConfig | null>(null);
  const [helloAnimationComplete, setHelloAnimationComplete] = useState(false);

  useEffect(() => {
    async function fetchAppsData() {
      setIsLoading(true);
      const appPromises = appBaseFolders.map(folder =>
        fetch(`/apps/${folder}/config.json`)
          .then(res => {
            if (!res.ok) {
              console.error(`Failed to fetch config for ${folder}: ${res.status}`);
              return null;
            }
            return res.json();
          })
          .then(data => data ? { ...data, folder } : null)
      );

      const results = await Promise.all(appPromises);
      const validApps = results.filter(app => app !== null) as AppConfig[];
      validApps.sort((a, b) => a.name.localeCompare(b.name));
      setApps(validApps);
      setIsLoading(false);
    }

    fetchAppsData(); // Fetch data on component mount
  }, []); // Empty dependency array: runs once on mount

  const handleAppClick = (app: AppConfig) => {
    setPanelApp(app);
    setShowPanel(true);
    window.open(app.link, '_blank');
    setTimeout(() => {
      setShowPanel(false);
      setPanelApp(null);
    }, 2000);
  };

  if (!helloAnimationComplete) {
    return <HelloAnimation onAnimationComplete={() => setHelloAnimationComplete(true)} />;
  }

  if (isLoading) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <p className="text-center text-xl">Loading apps...</p>
      </div>
    );
  }

  const filteredApps = apps.filter(app =>
    app.name.toLowerCase().includes(searchTerm.toLowerCase())
  );

  return (
    <div className="min-h-screen">
      <div className="container mx-auto max-w-4xl py-20 px-5">
        <h1 className="text-4xl font-semibold text-center mb-8">
          Mac App Downloads
        </h1>
        <input
          type="text"
          placeholder="Search apps"
          aria-label="Search apps"
          className="w-full p-3 mb-5 text-lg border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 outline-none"
          value={searchTerm}
          onChange={e => setSearchTerm(e.target.value)}
        />
        {filteredApps.length > 0 ? (
          <ul className="grid grid-cols-[repeat(auto-fill,minmax(120px,1fr))] gap-5">
            {filteredApps.map(app => (
              <li
                key={app.folder}
                className="flex flex-col items-center bg-white p-4 border border-gray-200 rounded-xl cursor-pointer hover:shadow-lg transition-shadow"
                onClick={() => handleAppClick(app)}
              >
                <Image
                  src={`/apps/${app.folder}/icon.png`}
                  alt={`${app.name} icon`}
                  width={64}
                  height={64}
                  className="mb-2.5 rounded-xl w-16 h-16"
                  priority={appBaseFolders.indexOf(app.folder) < 10} // Prioritize loading first few images
                />
                <span className="text-base text-center">{app.name}</span>
              </li>
            ))}
          </ul>
        ) : (
          <p className="text-center text-xl">
            {searchTerm ? `No apps found for "${searchTerm}".` : "No apps available."}
          </p>
        )}
      </div>

      {showPanel && panelApp && (
        <div className="fixed top-0 left-0 w-full h-full bg-black bg-opacity-50 flex items-center justify-center z-[1100]">
          <div className="bg-white p-8 rounded-xl text-center shadow-2xl">
            <h2 className="text-2xl font-semibold mb-2">{panelApp.name}</h2>
            <p>Opening download page...</p>
          </div>
        </div>
      )}
    </div>
  );
}
