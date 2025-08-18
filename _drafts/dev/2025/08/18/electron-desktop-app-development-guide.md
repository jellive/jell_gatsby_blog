---
title: '웹 개발자를 위한 Electron 데스크톱 앱 개발 실무 가이드'
date: '2025-08-18'
category: 'Dev'
tags: ['electron', 'javascript', 'typescript', 'react', 'desktop', 'app-development', 'cross-platform']
---

# 웹 개발자를 위한 Electron 데스크톱 앱 개발 실무 가이드

## 1. 서론 - 왜 웹 개발자가 Electron을 배워야 할까?

웹 개발자로서 React, Vue, Angular 등의 프레임워크에 익숙하다면, Electron은 기존 지식을 활용해 데스크톱 애플리케이션을 개발할 수 있는 매력적인 선택지입니다. Discord, Slack, Visual Studio Code, Figma 등 우리가 일상적으로 사용하는 많은 애플리케이션들이 Electron으로 개발되었습니다.

### Electron의 주요 장점

**크로스 플랫폼 개발**: 하나의 코드베이스로 Windows, macOS, Linux 애플리케이션을 동시에 개발할 수 있습니다. 각 플랫폼별로 네이티브 언어를 별도로 학습할 필요가 없어 개발 비용과 시간을 대폭 절감할 수 있습니다.

**기존 웹 기술 활용**: HTML, CSS, JavaScript를 그대로 사용하므로 별도의 학습 곡선 없이 바로 시작할 수 있습니다. 특히 React, Vue 등의 프레임워크 경험이 있다면 더욱 수월하게 접근할 수 있습니다.

**풍부한 생태계**: npm 생태계의 모든 패키지를 활용할 수 있어 개발 효율성이 높습니다. 웹 개발에서 사용하던 라이브러리들을 그대로 데스크톱 앱에서도 사용할 수 있습니다.

### 고려해야 할 단점

물론 Electron에도 단점이 있습니다. **메모리 사용량**이 네이티브 앱보다 높고, **앱 크기**가 클 수 있습니다. 또한 **성능 면에서 네이티브 앱보다 느릴 수 있습니다**. 하지만 이러한 단점들은 적절한 최적화를 통해 상당 부분 개선할 수 있으며, 개발 효율성과 유지보수성을 고려하면 충분히 받아들일 만한 트레이드오프입니다.

이 가이드에서는 단순한 튜토리얼을 넘어서, 실제 프로덕션 환경에서 Electron 앱을 개발하고 배포하기까지의 전 과정을 다루겠습니다. 간단한 파일 관리자 앱을 예시로 하여 실무에서 마주치게 될 다양한 상황들과 해결책들을 함께 살펴보겠습니다.

## 2. 개발 환경 구성 - Electron + React + TypeScript 프로젝트 셋업

실무에서는 JavaScript보다는 TypeScript를 사용하는 것이 권장됩니다. 타입 안정성을 제공하고, 대규모 프로젝트에서 유지보수성을 크게 향상시킵니다.

### 프로젝트 초기 설정

먼저 프로젝트 디렉토리를 생성하고 필요한 의존성을 설치하겠습니다:

```bash
mkdir electron-file-manager
cd electron-file-manager
npm init -y

# Electron 및 개발 도구 설치
npm install --save-dev electron
npm install --save-dev @types/node typescript
npm install --save-dev webpack webpack-cli webpack-dev-server
npm install --save-dev html-webpack-plugin copy-webpack-plugin
npm install --save-dev ts-loader style-loader css-loader

# React 관련 의존성
npm install react react-dom
npm install --save-dev @types/react @types/react-dom

# 유틸리티 라이브러리
npm install electron-is-dev
```

### TypeScript 설정

`tsconfig.json` 파일을 생성하여 TypeScript 설정을 구성합니다:

```json
{
  "compilerOptions": {
    "target": "ES2020",
    "lib": ["dom", "dom.iterable", "ES6"],
    "allowJs": true,
    "skipLibCheck": true,
    "esModuleInterop": true,
    "allowSyntheticDefaultImports": true,
    "strict": true,
    "forceConsistentCasingInFileNames": true,
    "module": "esnext",
    "moduleResolution": "node",
    "resolveJsonModule": true,
    "isolatedModules": true,
    "noEmit": true,
    "jsx": "react-jsx"
  },
  "include": [
    "src",
    "electron"
  ]
}
```

### 프로젝트 구조

실무에서 권장하는 프로젝트 구조는 다음과 같습니다:

```
electron-file-manager/
├── electron/
│   ├── main.ts          # Main Process
│   ├── preload.ts       # Preload Script
│   └── types.ts         # 타입 정의
├── src/
│   ├── components/      # React 컴포넌트
│   ├── hooks/          # Custom Hooks
│   ├── utils/          # 유틸리티 함수
│   ├── types/          # 프론트엔드 타입
│   ├── App.tsx
│   └── index.tsx
├── public/
│   └── index.html
├── webpack.config.js
└── package.json
```

### package.json 스크립트 설정

```json
{
  "main": "build/electron/main.js",
  "scripts": {
    "electron": "electron .",
    "electron-dev": "ELECTRON_IS_DEV=true electron .",
    "build": "webpack --mode=production",
    "build-electron": "tsc electron/main.ts --outDir build/electron --target ES2020 --module commonjs --moduleResolution node --esModuleInterop",
    "start": "webpack serve --mode=development",
    "dev": "concurrently \"npm run start\" \"wait-on http://localhost:3000 && npm run electron-dev\"",
    "dist": "npm run build && npm run build-electron && electron-builder"
  }
}
```

### Webpack 설정

`webpack.config.js`를 생성하여 React 앱을 빌드할 설정을 구성합니다:

```javascript
const HtmlWebpackPlugin = require('html-webpack-plugin');
const path = require('path');

module.exports = {
  entry: './src/index.tsx',
  mode: 'development',
  output: {
    path: path.resolve(__dirname, 'build'),
    filename: 'bundle.js',
  },
  module: {
    rules: [
      {
        test: /\.tsx?$/,
        use: 'ts-loader',
        exclude: /node_modules/,
      },
      {
        test: /\.css$/i,
        use: ['style-loader', 'css-loader'],
      },
    ],
  },
  resolve: {
    extensions: ['.tsx', '.ts', '.js'],
  },
  plugins: [
    new HtmlWebpackPlugin({
      template: './public/index.html',
    }),
  ],
  devServer: {
    port: 3000,
    hot: true,
  },
  target: 'electron-renderer',
};
```

## 3. 기본 앱 구조 이해 - Main Process vs Renderer Process

Electron의 핵심은 두 가지 프로세스를 이해하는 것입니다. 이 개념을 제대로 이해하지 못하면 나중에 심각한 보안 문제나 성능 문제에 직면할 수 있습니다.

### Main Process 구현

`electron/main.ts` 파일을 생성합니다:

```typescript
import { app, BrowserWindow, Menu, ipcMain } from 'electron';
import * as path from 'path';
import * as isDev from 'electron-is-dev';
import { promises as fs } from 'fs';

class ElectronApp {
  private mainWindow: BrowserWindow | null = null;

  constructor() {
    this.initializeApp();
  }

  private initializeApp(): void {
    app.whenReady().then(() => {
      this.createMainWindow();
      this.setupIpcHandlers();
      this.setupMenu();

      app.on('activate', () => {
        if (BrowserWindow.getAllWindows().length === 0) {
          this.createMainWindow();
        }
      });
    });

    app.on('window-all-closed', () => {
      if (process.platform !== 'darwin') {
        app.quit();
      }
    });
  }

  private createMainWindow(): void {
    this.mainWindow = new BrowserWindow({
      width: 1200,
      height: 800,
      webPreferences: {
        nodeIntegration: false, // 보안상 중요
        contextIsolation: true, // 보안상 중요
        preload: path.join(__dirname, 'preload.js'),
      },
      titleBarStyle: 'hiddenInset', // macOS용 스타일
      show: false, // 초기 로드 완료까지 숨김
    });

    // 로드 완료 후 창 표시
    this.mainWindow.once('ready-to-show', () => {
      this.mainWindow?.show();
    });

    // 개발/프로덕션 환경에 따른 URL 로드
    const startUrl = isDev 
      ? 'http://localhost:3000' 
      : `file://${path.join(__dirname, '../build/index.html')}`;
    
    this.mainWindow.loadURL(startUrl);

    // 개발 환경에서만 DevTools 자동 열기
    if (isDev) {
      this.mainWindow.webContents.openDevTools();
    }
  }

  private setupIpcHandlers(): void {
    // 파일 시스템 관련 IPC 핸들러
    ipcMain.handle('read-directory', async (event, dirPath: string) => {
      try {
        const items = await fs.readdir(dirPath, { withFileTypes: true });
        return items.map(item => ({
          name: item.name,
          isDirectory: item.isDirectory(),
          path: path.join(dirPath, item.name)
        }));
      } catch (error) {
        throw new Error(`디렉토리를 읽을 수 없습니다: ${error.message}`);
      }
    });

    ipcMain.handle('read-file', async (event, filePath: string) => {
      try {
        const content = await fs.readFile(filePath, 'utf-8');
        return content;
      } catch (error) {
        throw new Error(`파일을 읽을 수 없습니다: ${error.message}`);
      }
    });

    ipcMain.handle('write-file', async (event, filePath: string, content: string) => {
      try {
        await fs.writeFile(filePath, content, 'utf-8');
        return true;
      } catch (error) {
        throw new Error(`파일을 저장할 수 없습니다: ${error.message}`);
      }
    });
  }

  private setupMenu(): void {
    const template = [
      {
        label: '파일',
        submenu: [
          {
            label: '새 파일',
            accelerator: 'CmdOrCtrl+N',
            click: () => {
              this.mainWindow?.webContents.send('menu-new-file');
            }
          },
          {
            label: '열기',
            accelerator: 'CmdOrCtrl+O',
            click: () => {
              this.mainWindow?.webContents.send('menu-open-file');
            }
          },
          { type: 'separator' },
          {
            label: '종료',
            accelerator: process.platform === 'darwin' ? 'Cmd+Q' : 'Ctrl+Q',
            click: () => {
              app.quit();
            }
          }
        ]
      },
      {
        label: '보기',
        submenu: [
          {
            label: '새로고침',
            accelerator: 'CmdOrCtrl+R',
            click: () => {
              this.mainWindow?.reload();
            }
          },
          {
            label: '개발자 도구',
            accelerator: 'F12',
            click: () => {
              this.mainWindow?.webContents.toggleDevTools();
            }
          }
        ]
      }
    ];

    const menu = Menu.buildFromTemplate(template as any);
    Menu.setApplicationMenu(menu);
  }
}

// 앱 인스턴스 생성
new ElectronApp();
```

### Preload Script 구현

보안을 위해 Renderer Process에서 직접 Node.js API에 접근하지 않고, Preload Script를 통해 안전한 API를 제공합니다.

`electron/preload.ts`:

```typescript
import { contextBridge, ipcRenderer } from 'electron';

// Renderer Process에서 사용할 API 정의
export interface ElectronAPI {
  // 파일 시스템 API
  readDirectory: (path: string) => Promise<Array<{
    name: string;
    isDirectory: boolean;
    path: string;
  }>>;
  readFile: (path: string) => Promise<string>;
  writeFile: (path: string, content: string) => Promise<boolean>;
  
  // 메뉴 이벤트 리스너
  onMenuAction: (callback: (action: string) => void) => void;
  removeMenuActionListener: (callback: (action: string) => void) => void;
}

// 안전한 API를 window 객체에 노출
contextBridge.exposeInMainWorld('electronAPI', {
  readDirectory: (path: string) => ipcRenderer.invoke('read-directory', path),
  readFile: (path: string) => ipcRenderer.invoke('read-file', path),
  writeFile: (path: string, content: string) => ipcRenderer.invoke('write-file', path, content),
  
  onMenuAction: (callback: (action: string) => void) => {
    const handler = (event: any, action: string) => callback(action);
    ipcRenderer.on('menu-new-file', handler);
    ipcRenderer.on('menu-open-file', handler);
  },
  
  removeMenuActionListener: (callback: (action: string) => void) => {
    ipcRenderer.removeListener('menu-new-file', callback);
    ipcRenderer.removeListener('menu-open-file', callback);
  }
});

// TypeScript를 위한 전역 타입 정의
declare global {
  interface Window {
    electronAPI: ElectronAPI;
  }
}
```

### Renderer Process 구현

`src/App.tsx`:

```typescript
import React, { useState, useEffect } from 'react';
import FileExplorer from './components/FileExplorer';
import FileEditor from './components/FileEditor';
import './App.css';

interface FileItem {
  name: string;
  isDirectory: boolean;
  path: string;
}

const App: React.FC = () => {
  const [currentPath, setCurrentPath] = useState<string>(process.cwd());
  const [selectedFile, setSelectedFile] = useState<string | null>(null);
  const [fileContent, setFileContent] = useState<string>('');

  // 메뉴 액션 처리
  useEffect(() => {
    const handleMenuAction = (action: string) => {
      switch (action) {
        case 'menu-new-file':
          setSelectedFile(null);
          setFileContent('');
          break;
        case 'menu-open-file':
          // 파일 선택 다이얼로그 로직
          break;
      }
    };

    window.electronAPI.onMenuAction(handleMenuAction);

    return () => {
      window.electronAPI.removeMenuActionListener(handleMenuAction);
    };
  }, []);

  const handleFileSelect = async (filePath: string, isDirectory: boolean) => {
    if (isDirectory) {
      setCurrentPath(filePath);
    } else {
      try {
        const content = await window.electronAPI.readFile(filePath);
        setSelectedFile(filePath);
        setFileContent(content);
      } catch (error) {
        console.error('파일 읽기 실패:', error);
      }
    }
  };

  const handleFileSave = async (content: string) => {
    if (!selectedFile) return;
    
    try {
      await window.electronAPI.writeFile(selectedFile, content);
      console.log('파일이 저장되었습니다.');
    } catch (error) {
      console.error('파일 저장 실패:', error);
    }
  };

  return (
    <div className="app">
      <div className="app-sidebar">
        <FileExplorer 
          currentPath={currentPath}
          onFileSelect={handleFileSelect}
          onPathChange={setCurrentPath}
        />
      </div>
      <div className="app-content">
        <FileEditor 
          content={fileContent}
          onContentChange={setFileContent}
          onSave={handleFileSave}
          fileName={selectedFile}
        />
      </div>
    </div>
  );
};

export default App;
```

## 4. React 컴포넌트와 Electron API 연동 - IPC 통신 활용하기

IPC(Inter-Process Communication)는 Electron의 핵심 개념입니다. Main Process와 Renderer Process 간의 안전한 통신을 위해 다양한 패턴을 사용할 수 있습니다.

### 커스텀 Hook을 통한 IPC 추상화

`src/hooks/useElectronAPI.ts`:

```typescript
import { useState, useEffect, useCallback } from 'react';

interface FileItem {
  name: string;
  isDirectory: boolean;
  path: string;
}

export const useElectronAPI = () => {
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const readDirectory = useCallback(async (path: string): Promise<FileItem[]> => {
    setIsLoading(true);
    setError(null);
    
    try {
      const items = await window.electronAPI.readDirectory(path);
      return items;
    } catch (err) {
      const errorMessage = err instanceof Error ? err.message : '알 수 없는 오류가 발생했습니다.';
      setError(errorMessage);
      throw err;
    } finally {
      setIsLoading(false);
    }
  }, []);

  const readFile = useCallback(async (path: string): Promise<string> => {
    setIsLoading(true);
    setError(null);
    
    try {
      const content = await window.electronAPI.readFile(path);
      return content;
    } catch (err) {
      const errorMessage = err instanceof Error ? err.message : '파일을 읽을 수 없습니다.';
      setError(errorMessage);
      throw err;
    } finally {
      setIsLoading(false);
    }
  }, []);

  const writeFile = useCallback(async (path: string, content: string): Promise<boolean> => {
    setIsLoading(true);
    setError(null);
    
    try {
      const result = await window.electronAPI.writeFile(path, content);
      return result;
    } catch (err) {
      const errorMessage = err instanceof Error ? err.message : '파일을 저장할 수 없습니다.';
      setError(errorMessage);
      throw err;
    } finally {
      setIsLoading(false);
    }
  }, []);

  return {
    readDirectory,
    readFile,
    writeFile,
    isLoading,
    error,
    clearError: () => setError(null)
  };
};
```

### 파일 탐색기 컴포넌트

`src/components/FileExplorer.tsx`:

```typescript
import React, { useState, useEffect } from 'react';
import { useElectronAPI } from '../hooks/useElectronAPI';

interface FileItem {
  name: string;
  isDirectory: boolean;
  path: string;
}

interface FileExplorerProps {
  currentPath: string;
  onFileSelect: (path: string, isDirectory: boolean) => void;
  onPathChange: (path: string) => void;
}

const FileExplorer: React.FC<FileExplorerProps> = ({
  currentPath,
  onFileSelect,
  onPathChange
}) => {
  const [items, setItems] = useState<FileItem[]>([]);
  const { readDirectory, isLoading, error } = useElectronAPI();

  useEffect(() => {
    loadDirectory(currentPath);
  }, [currentPath]);

  const loadDirectory = async (path: string) => {
    try {
      const dirItems = await readDirectory(path);
      
      // 디렉토리를 먼저, 파일을 나중에 정렬
      const sortedItems = dirItems.sort((a, b) => {
        if (a.isDirectory && !b.isDirectory) return -1;
        if (!a.isDirectory && b.isDirectory) return 1;
        return a.name.localeCompare(b.name);
      });
      
      setItems(sortedItems);
    } catch (err) {
      console.error('디렉토리 로드 실패:', err);
    }
  };

  const handleItemClick = (item: FileItem) => {
    onFileSelect(item.path, item.isDirectory);
  };

  const handleBackClick = () => {
    const parentPath = currentPath.split('/').slice(0, -1).join('/') || '/';
    onPathChange(parentPath);
  };

  if (isLoading) {
    return <div className="file-explorer loading">로딩 중...</div>;
  }

  if (error) {
    return (
      <div className="file-explorer error">
        <p>오류 발생: {error}</p>
        <button onClick={() => loadDirectory(currentPath)}>다시 시도</button>
      </div>
    );
  }

  return (
    <div className="file-explorer">
      <div className="path-bar">
        <button onClick={handleBackClick} disabled={currentPath === '/'}>
          ← 뒤로
        </button>
        <span className="current-path">{currentPath}</span>
      </div>
      
      <div className="file-list">
        {items.map((item) => (
          <div
            key={item.path}
            className={`file-item ${item.isDirectory ? 'directory' : 'file'}`}
            onClick={() => handleItemClick(item)}
          >
            <span className="file-icon">
              {item.isDirectory ? '📁' : '📄'}
            </span>
            <span className="file-name">{item.name}</span>
          </div>
        ))}
      </div>
    </div>
  );
};

export default FileExplorer;
```

### 파일 에디터 컴포넌트

`src/components/FileEditor.tsx`:

```typescript
import React, { useState, useEffect, useCallback } from 'react';
import { useElectronAPI } from '../hooks/useElectronAPI';

interface FileEditorProps {
  content: string;
  onContentChange: (content: string) => void;
  onSave: (content: string) => void;
  fileName: string | null;
}

const FileEditor: React.FC<FileEditorProps> = ({
  content,
  onContentChange,
  onSave,
  fileName
}) => {
  const [hasUnsavedChanges, setHasUnsavedChanges] = useState(false);
  const { isLoading } = useElectronAPI();

  // 자동 저장 기능
  useEffect(() => {
    if (!hasUnsavedChanges || !fileName) return;

    const autoSaveTimer = setTimeout(() => {
      handleSave();
    }, 2000); // 2초 후 자동 저장

    return () => clearTimeout(autoSaveTimer);
  }, [content, hasUnsavedChanges, fileName]);

  // 단축키 처리
  useEffect(() => {
    const handleKeyDown = (event: KeyboardEvent) => {
      if ((event.ctrlKey || event.metaKey) && event.key === 's') {
        event.preventDefault();
        handleSave();
      }
    };

    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [content]);

  const handleContentChange = (newContent: string) => {
    onContentChange(newContent);
    setHasUnsavedChanges(true);
  };

  const handleSave = useCallback(() => {
    if (!fileName) return;
    
    onSave(content);
    setHasUnsavedChanges(false);
  }, [content, fileName, onSave]);

  if (!fileName) {
    return (
      <div className="file-editor empty">
        <p>파일을 선택하여 편집을 시작하세요.</p>
      </div>
    );
  }

  return (
    <div className="file-editor">
      <div className="editor-header">
        <h3>{fileName.split('/').pop()}</h3>
        <div className="editor-actions">
          {hasUnsavedChanges && <span className="unsaved-indicator">●</span>}
          <button 
            onClick={handleSave} 
            disabled={isLoading || !hasUnsavedChanges}
          >
            저장 (Ctrl+S)
          </button>
        </div>
      </div>
      
      <textarea
        className="editor-textarea"
        value={content}
        onChange={(e) => handleContentChange(e.target.value)}
        placeholder="파일 내용을 입력하세요..."
        disabled={isLoading}
      />
      
      <div className="editor-footer">
        <span>줄: {content.split('\n').length}</span>
        <span>글자: {content.length}</span>
      </div>
    </div>
  );
};

export default FileEditor;
```

## 5. 네이티브 기능 구현 - 파일 시스템, 시스템 트레이, 단축키 등

Electron의 진정한 장점은 웹 기술로 네이티브 기능을 구현할 수 있다는 점입니다. 시스템 트레이, 글로벌 단축키, 시스템 알림 등의 기능을 구현해보겠습니다.

### 시스템 트레이 구현

`electron/main.ts`에 트레이 기능을 추가합니다:

```typescript
import { app, BrowserWindow, Menu, Tray, nativeImage } from 'electron';
import * as path from 'path';

class ElectronApp {
  private mainWindow: BrowserWindow | null = null;
  private tray: Tray | null = null;

  private createTray(): void {
    // 트레이 아이콘 생성 (16x16 픽셀 권장)
    const trayIcon = nativeImage.createFromPath(
      path.join(__dirname, '../assets/tray-icon.png')
    );
    
    this.tray = new Tray(trayIcon);
    
    const contextMenu = Menu.buildFromTemplate([
      {
        label: '파일 관리자 열기',
        click: () => {
          this.showMainWindow();
        }
      },
      {
        label: '새 파일',
        click: () => {
          this.mainWindow?.webContents.send('menu-new-file');
        }
      },
      { type: 'separator' },
      {
        label: '환경설정',
        click: () => {
          this.openPreferences();
        }
      },
      { type: 'separator' },
      {
        label: '종료',
        click: () => {
          app.quit();
        }
      }
    ]);

    this.tray.setContextMenu(contextMenu);
    this.tray.setToolTip('파일 관리자');
    
    // 트레이 아이콘 클릭 이벤트
    this.tray.on('click', () => {
      this.toggleMainWindow();
    });
  }

  private showMainWindow(): void {
    if (this.mainWindow) {
      if (this.mainWindow.isMinimized()) {
        this.mainWindow.restore();
      }
      this.mainWindow.show();
      this.mainWindow.focus();
    } else {
      this.createMainWindow();
    }
  }

  private toggleMainWindow(): void {
    if (this.mainWindow?.isVisible()) {
      this.mainWindow.hide();
    } else {
      this.showMainWindow();
    }
  }

  private openPreferences(): void {
    // 환경설정 창 구현
    const preferencesWindow = new BrowserWindow({
      width: 600,
      height: 400,
      parent: this.mainWindow,
      modal: true,
      webPreferences: {
        nodeIntegration: false,
        contextIsolation: true,
        preload: path.join(__dirname, 'preload.js'),
      }
    });

    preferencesWindow.loadFile(path.join(__dirname, '../build/preferences.html'));
  }
}
```

### 글로벌 단축키 구현

```typescript
import { globalShortcut } from 'electron';

class ElectronApp {
  private registerGlobalShortcuts(): void {
    // 전역 단축키 등록
    globalShortcut.register('CommandOrControl+Shift+F', () => {
      this.showMainWindow();
    });

    globalShortcut.register('CommandOrControl+Shift+N', () => {
      this.mainWindow?.webContents.send('menu-new-file');
    });

    globalShortcut.register('CommandOrControl+Shift+S', () => {
      this.mainWindow?.webContents.send('quick-save');
    });
  }

  private initializeApp(): void {
    app.whenReady().then(() => {
      this.createMainWindow();
      this.createTray();
      this.registerGlobalShortcuts();
      this.setupIpcHandlers();
    });

    app.on('will-quit', () => {
      // 앱 종료 시 전역 단축키 해제
      globalShortcut.unregisterAll();
    });
  }
}
```

### 시스템 알림 구현

시스템 알림을 위한 새로운 IPC 핸들러를 추가합니다:

```typescript
import { Notification } from 'electron';

private setupIpcHandlers(): void {
  // 기존 핸들러들...

  ipcMain.handle('show-notification', async (event, options: {
    title: string;
    body: string;
    urgency?: 'normal' | 'critical' | 'low';
  }) => {
    const notification = new Notification({
      title: options.title,
      body: options.body,
      urgency: options.urgency || 'normal',
      actions: [
        {
          type: 'button',
          text: '열기'
        }
      ]
    });

    notification.on('click', () => {
      this.showMainWindow();
    });

    notification.on('action', (event, index) => {
      if (index === 0) { // '열기' 버튼
        this.showMainWindow();
      }
    });

    notification.show();
  });
}
```

Preload Script와 컴포넌트에서 알림 기능을 사용할 수 있도록 API를 확장합니다:

```typescript
// preload.ts에 추가
contextBridge.exposeInMainWorld('electronAPI', {
  // 기존 API들...
  showNotification: (options: {
    title: string;
    body: string;
    urgency?: 'normal' | 'critical' | 'low';
  }) => ipcRenderer.invoke('show-notification', options),
});

// React 컴포넌트에서 사용
const handleFileSave = async (content: string) => {
  if (!selectedFile) return;
  
  try {
    await window.electronAPI.writeFile(selectedFile, content);
    
    // 저장 완료 알림
    await window.electronAPI.showNotification({
      title: '파일 저장 완료',
      body: `${selectedFile.split('/').pop()}이 저장되었습니다.`,
      urgency: 'normal'
    });
  } catch (error) {
    // 오류 알림
    await window.electronAPI.showNotification({
      title: '저장 실패',
      body: '파일을 저장하는 중 오류가 발생했습니다.',
      urgency: 'critical'
    });
  }
};
```

### 다크모드 토글 구현

시스템 테마와 연동되는 다크모드를 구현합니다:

```typescript
import { nativeTheme } from 'electron';

private setupIpcHandlers(): void {
  // 기존 핸들러들...

  // 테마 관련 핸들러
  ipcMain.handle('get-theme', () => {
    return nativeTheme.shouldUseDarkColors ? 'dark' : 'light';
  });

  ipcMain.handle('set-theme', (event, theme: 'system' | 'light' | 'dark') => {
    nativeTheme.themeSource = theme;
    return nativeTheme.shouldUseDarkColors ? 'dark' : 'light';
  });

  // 시스템 테마 변경 감지
  nativeTheme.on('updated', () => {
    const currentTheme = nativeTheme.shouldUseDarkColors ? 'dark' : 'light';
    this.mainWindow?.webContents.send('theme-changed', currentTheme);
  });
}
```

React에서 테마 관리를 위한 컨텍스트를 구현합니다:

```typescript
// src/contexts/ThemeContext.tsx
import React, { createContext, useContext, useState, useEffect } from 'react';

type Theme = 'light' | 'dark';
type ThemeSource = 'system' | 'light' | 'dark';

interface ThemeContextType {
  theme: Theme;
  themeSource: ThemeSource;
  setThemeSource: (source: ThemeSource) => void;
}

const ThemeContext = createContext<ThemeContextType | undefined>(undefined);

export const ThemeProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [theme, setTheme] = useState<Theme>('light');
  const [themeSource, setThemeSourceState] = useState<ThemeSource>('system');

  useEffect(() => {
    // 초기 테마 로드
    window.electronAPI.getTheme().then(setTheme);

    // 시스템 테마 변경 감지
    const handleThemeChange = (newTheme: Theme) => {
      setTheme(newTheme);
      document.documentElement.setAttribute('data-theme', newTheme);
    };

    window.electronAPI.onThemeChanged(handleThemeChange);

    return () => {
      window.electronAPI.removeThemeChangedListener(handleThemeChange);
    };
  }, []);

  const setThemeSource = async (source: ThemeSource) => {
    setThemeSourceState(source);
    const newTheme = await window.electronAPI.setTheme(source);
    setTheme(newTheme);
    document.documentElement.setAttribute('data-theme', newTheme);
  };

  return (
    <ThemeContext.Provider value={{ theme, themeSource, setThemeSource }}>
      {children}
    </ThemeContext.Provider>
  );
};

export const useTheme = () => {
  const context = useContext(ThemeContext);
  if (!context) {
    throw new Error('useTheme must be used within a ThemeProvider');
  }
  return context;
};
```

## 6. 앱 패키징과 배포 - 각 OS별 빌드 및 배포 전략

프로덕션 배포를 위해서는 electron-builder를 사용하는 것이 가장 일반적입니다. 각 운영체제별로 최적화된 설정과 코드 사이닝까지 고려해보겠습니다.

### electron-builder 설정

먼저 필요한 의존성을 설치합니다:

```bash
npm install --save-dev electron-builder
npm install --save-dev @electron/rebuild
```

`package.json`에 빌드 설정을 추가합니다:

```json
{
  "build": {
    "appId": "com.yourcompany.file-manager",
    "productName": "File Manager",
    "directories": {
      "output": "dist"
    },
    "files": [
      "build/**/*",
      "node_modules/**/*",
      "!node_modules/**/*.{md,txt}",
      "!node_modules/**/test/**/*"
    ],
    "mac": {
      "category": "public.app-category.productivity",
      "icon": "assets/icon.icns",
      "hardenedRuntime": true,
      "gatekeeperAssess": false,
      "entitlements": "assets/entitlements.mac.plist",
      "entitlementsInherit": "assets/entitlements.mac.plist",
      "target": [
        {
          "target": "default",
          "arch": ["x64", "arm64"]
        }
      ]
    },
    "win": {
      "icon": "assets/icon.ico",
      "target": [
        {
          "target": "nsis",
          "arch": ["x64", "ia32"]
        }
      ],
      "publisherName": "Your Company Name"
    },
    "linux": {
      "icon": "assets/icon.png",
      "category": "Utility",
      "target": [
        {
          "target": "AppImage",
          "arch": ["x64"]
        },
        {
          "target": "deb",
          "arch": ["x64"]
        }
      ]
    },
    "nsis": {
      "oneClick": false,
      "allowToChangeInstallationDirectory": true,
      "createDesktopShortcut": true,
      "createStartMenuShortcut": true
    }
  }
}
```

### 플랫폼별 빌드 스크립트

```json
{
  "scripts": {
    "build:all": "npm run build && npm run build-electron",
    "dist": "npm run build:all && electron-builder",
    "dist:mac": "npm run build:all && electron-builder --mac",
    "dist:win": "npm run build:all && electron-builder --win",
    "dist:linux": "npm run build:all && electron-builder --linux",
    "publish": "npm run build:all && electron-builder --publish=always"
  }
}
```

### macOS 코드 사이닝 설정

macOS에서 앱을 배포하려면 Apple Developer Program에 가입하고 코드 사이닝을 해야 합니다.

`assets/entitlements.mac.plist`:

```xml
<?xml version="1.0" encoding="UTF-8"?>
<!DOCTYPE plist PUBLIC "-//Apple//DTD PLIST 1.0//EN" "http://www.apple.com/DTDs/PropertyList-1.0.dtd">
<plist version="1.0">
  <dict>
    <key>com.apple.security.cs.allow-jit</key>
    <true/>
    <key>com.apple.security.cs.allow-unsigned-executable-memory</key>
    <true/>
    <key>com.apple.security.cs.debugger</key>
    <true/>
    <key>com.apple.security.cs.disable-library-validation</key>
    <true/>
    <key>com.apple.security.cs.allow-dyld-environment-variables</key>
    <true/>
  </dict>
</plist>
```

환경 변수로 개발자 인증서 정보를 설정합니다:

```bash
export CSC_LINK="path/to/certificate.p12"
export CSC_KEY_PASSWORD="certificate_password"
export APPLE_ID="your_apple_id"
export APPLE_ID_PASSWORD="app_specific_password"
```

### Windows 코드 사이닝

Windows용 앱에도 코드 사이닝을 적용할 수 있습니다:

```bash
export CSC_LINK="path/to/certificate.p12"
export CSC_KEY_PASSWORD="certificate_password"
```

### 자동 업데이트 구현

electron-updater를 사용하여 자동 업데이트 기능을 구현합니다:

```bash
npm install electron-updater
```

`electron/main.ts`에 자동 업데이트 로직을 추가합니다:

```typescript
import { autoUpdater } from 'electron-updater';

class ElectronApp {
  private initializeApp(): void {
    app.whenReady().then(() => {
      this.createMainWindow();
      this.setupAutoUpdater();
    });
  }

  private setupAutoUpdater(): void {
    // 개발 환경에서는 자동 업데이트 비활성화
    if (isDev) return;

    autoUpdater.checkForUpdatesAndNotify();

    autoUpdater.on('update-available', () => {
      this.mainWindow?.webContents.send('update-available');
    });

    autoUpdater.on('update-downloaded', () => {
      this.mainWindow?.webContents.send('update-downloaded');
    });

    // 주기적으로 업데이트 확인 (1시간마다)
    setInterval(() => {
      autoUpdater.checkForUpdatesAndNotify();
    }, 60 * 60 * 1000);
  }
}
```

### CI/CD 파이프라인 구성

GitHub Actions를 사용한 자동 빌드 및 배포 설정:

`.github/workflows/build.yml`:

```yaml
name: Build and Release

on:
  push:
    tags:
      - 'v*'

jobs:
  build:
    runs-on: ${{ matrix.os }}
    
    strategy:
      matrix:
        os: [macos-latest, windows-latest, ubuntu-latest]
    
    steps:
      - name: Checkout code
        uses: actions/checkout@v3
      
      - name: Setup Node.js
        uses: actions/setup-node@v3
        with:
          node-version: '18'
          cache: 'npm'
      
      - name: Install dependencies
        run: npm ci
      
      - name: Build application
        run: npm run build:all
      
      - name: Build Electron app (macOS)
        if: matrix.os == 'macos-latest'
        run: npm run dist:mac
        env:
          CSC_LINK: ${{ secrets.CSC_LINK }}
          CSC_KEY_PASSWORD: ${{ secrets.CSC_KEY_PASSWORD }}
          APPLE_ID: ${{ secrets.APPLE_ID }}
          APPLE_ID_PASSWORD: ${{ secrets.APPLE_ID_PASSWORD }}
      
      - name: Build Electron app (Windows)
        if: matrix.os == 'windows-latest'
        run: npm run dist:win
        env:
          CSC_LINK: ${{ secrets.CSC_LINK }}
          CSC_KEY_PASSWORD: ${{ secrets.CSC_KEY_PASSWORD }}
      
      - name: Build Electron app (Linux)
        if: matrix.os == 'ubuntu-latest'
        run: npm run dist:linux
      
      - name: Upload artifacts
        uses: actions/upload-artifact@v3
        with:
          name: ${{ matrix.os }}-build
          path: dist/
```

## 7. 보안 고려사항 - Node.js 통합과 보안 설정

Electron 앱의 보안은 매우 중요합니다. 웹 콘텐츠가 시스템에 직접 접근할 수 있기 때문에 적절한 보안 설정이 필수입니다.

### 보안 베스트 프랙티스

#### 1. Context Isolation 활성화

```typescript
const mainWindow = new BrowserWindow({
  webPreferences: {
    nodeIntegration: false,        // Node.js 통합 비활성화
    contextIsolation: true,        // 컨텍스트 격리 활성화
    enableRemoteModule: false,     // Remote 모듈 비활성화
    preload: path.join(__dirname, 'preload.js'),
  },
});
```

#### 2. 안전한 Preload Script 작성

```typescript
// 안전하지 않은 예시 - 피해야 할 패턴
contextBridge.exposeInMainWorld('electronAPI', {
  // 절대 하지 말 것!
  nodeRequire: require,
  executeCommand: (cmd: string) => require('child_process').exec(cmd)
});

// 안전한 예시 - 권장 패턴
contextBridge.exposeInMainWorld('electronAPI', {
  // 검증된 API만 노출
  readFile: (path: string) => {
    // 경로 검증
    if (!path || typeof path !== 'string') {
      throw new Error('Invalid file path');
    }
    
    // 허용된 확장자만 허용
    const allowedExtensions = ['.txt', '.md', '.json', '.js', '.ts'];
    const extension = path.substring(path.lastIndexOf('.'));
    
    if (!allowedExtensions.includes(extension)) {
      throw new Error('File type not allowed');
    }
    
    return ipcRenderer.invoke('read-file', path);
  }
});
```

#### 3. 입력 검증 및 파일 경로 보안

Main Process에서 철저한 입력 검증을 수행합니다:

```typescript
import * as path from 'path';
import { promises as fs } from 'fs';

private setupIpcHandlers(): void {
  ipcMain.handle('read-file', async (event, filePath: string) => {
    try {
      // 입력 검증
      if (!filePath || typeof filePath !== 'string') {
        throw new Error('Invalid file path provided');
      }

      // 경로 정규화 및 보안 검사
      const normalizedPath = path.normalize(filePath);
      
      // 상위 디렉토리 접근 방지 (../ 공격 방지)
      if (normalizedPath.includes('..')) {
        throw new Error('Access to parent directories is not allowed');
      }

      // 시스템 파일 접근 방지
      const restrictedPaths = [
        '/etc/',
        '/usr/bin/',
        '/System/',
        'C:\\Windows\\',
        'C:\\Program Files\\'
      ];

      if (restrictedPaths.some(restricted => normalizedPath.startsWith(restricted))) {
        throw new Error('Access to system files is not allowed');
      }

      // 파일 존재 여부 및 권한 확인
      const stats = await fs.stat(normalizedPath);
      if (!stats.isFile()) {
        throw new Error('Path is not a file');
      }

      // 파일 크기 제한 (예: 10MB)
      if (stats.size > 10 * 1024 * 1024) {
        throw new Error('File is too large');
      }

      const content = await fs.readFile(normalizedPath, 'utf-8');
      return content;

    } catch (error) {
      console.error('File read error:', error);
      throw new Error(`Failed to read file: ${error.message}`);
    }
  });
}
```

#### 4. CSP (Content Security Policy) 설정

HTML 파일에 엄격한 CSP를 설정합니다:

```html
<!DOCTYPE html>
<html>
<head>
  <meta charset="UTF-8">
  <meta http-equiv="Content-Security-Policy" content="
    default-src 'self';
    script-src 'self' 'unsafe-inline';
    style-src 'self' 'unsafe-inline';
    img-src 'self' data: https:;
    connect-src 'self';
    font-src 'self';
  ">
  <title>File Manager</title>
</head>
<body>
  <div id="root"></div>
</body>
</html>
```

#### 5. 외부 콘텐츠 로드 제한

```typescript
private createMainWindow(): void {
  this.mainWindow = new BrowserWindow({
    webPreferences: {
      nodeIntegration: false,
      contextIsolation: true,
      webSecurity: true,           // 웹 보안 활성화
      allowRunningInsecureContent: false, // 안전하지 않은 콘텐츠 차단
      experimentalFeatures: false, // 실험적 기능 비활성화
      preload: path.join(__dirname, 'preload.js'),
    },
  });

  // 새 창 열기 제한
  this.mainWindow.webContents.setWindowOpenHandler(({ url }) => {
    // 허용된 도메인만 새 창으로 열기 허용
    const allowedDomains = ['https://your-domain.com'];
    
    if (allowedDomains.some(domain => url.startsWith(domain))) {
      return { action: 'allow' };
    }
    
    return { action: 'deny' };
  });

  // 네비게이션 제한
  this.mainWindow.webContents.on('will-navigate', (event, url) => {
    if (!url.startsWith('file://') && !url.startsWith('http://localhost:')) {
      event.preventDefault();
    }
  });
}
```

### 권한 관리 시스템

사용자가 민감한 작업을 수행할 때 명시적인 권한을 요청하는 시스템을 구현합니다:

```typescript
// 권한 관리자 클래스
class PermissionManager {
  private grantedPermissions: Set<string> = new Set();

  async requestPermission(permission: string, description: string): Promise<boolean> {
    if (this.grantedPermissions.has(permission)) {
      return true;
    }

    const result = await dialog.showMessageBox({
      type: 'question',
      buttons: ['허용', '거부'],
      defaultId: 1,
      title: '권한 요청',
      message: `다음 권한이 필요합니다: ${permission}`,
      detail: description
    });

    if (result.response === 0) {
      this.grantedPermissions.add(permission);
      return true;
    }

    return false;
  }

  revokePermission(permission: string): void {
    this.grantedPermissions.delete(permission);
  }

  hasPermission(permission: string): boolean {
    return this.grantedPermissions.has(permission);
  }
}

const permissionManager = new PermissionManager();

// 파일 삭제와 같은 민감한 작업에 권한 확인 적용
ipcMain.handle('delete-file', async (event, filePath: string) => {
  const hasPermission = await permissionManager.requestPermission(
    'file-delete',
    '파일을 삭제하려고 합니다. 이 작업은 되돌릴 수 없습니다.'
  );

  if (!hasPermission) {
    throw new Error('Permission denied');
  }

  // 파일 삭제 로직...
});
```

## 8. 성능 최적화 - 메모리 관리와 앱 성능 개선

Electron 앱의 성능 최적화는 사용자 경험에 직접적인 영향을 미칩니다. 메모리 사용량을 줄이고 응답성을 개선하는 다양한 기법들을 살펴보겠습니다.

### 메모리 관리 및 누수 방지

#### 1. 이벤트 리스너 정리

React 컴포넌트에서 Electron API를 사용할 때 메모리 누수를 방지하려면 적절한 cleanup이 필요합니다:

```typescript
// 메모리 누수가 있는 잘못된 예시
const BadComponent: React.FC = () => {
  useEffect(() => {
    const handleMenuAction = (action: string) => {
      console.log(action);
    };

    window.electronAPI.onMenuAction(handleMenuAction);
    // cleanup 누락! 메모리 누수 발생
  }, []);

  return <div>Component</div>;
};

// 올바른 예시
const GoodComponent: React.FC = () => {
  useEffect(() => {
    const handleMenuAction = (action: string) => {
      console.log(action);
    };

    window.electronAPI.onMenuAction(handleMenuAction);

    // cleanup 함수로 이벤트 리스너 제거
    return () => {
      window.electronAPI.removeMenuActionListener(handleMenuAction);
    };
  }, []);

  return <div>Component</div>;
};
```

#### 2. 대용량 파일 처리 최적화

큰 파일을 처리할 때는 스트리밍과 청크 단위 처리를 사용합니다:

```typescript
import { createReadStream } from 'fs';
import { pipeline } from 'stream/promises';

private setupIpcHandlers(): void {
  ipcMain.handle('read-large-file', async (event, filePath: string) => {
    const CHUNK_SIZE = 64 * 1024; // 64KB 청크
    const chunks: string[] = [];

    try {
      const stream = createReadStream(filePath, { 
        encoding: 'utf-8',
        highWaterMark: CHUNK_SIZE 
      });

      stream.on('data', (chunk) => {
        // 청크별로 프론트엔드에 전송
        event.sender.send('file-chunk', chunk);
      });

      stream.on('end', () => {
        event.sender.send('file-read-complete');
      });

      stream.on('error', (error) => {
        event.sender.send('file-read-error', error.message);
      });

    } catch (error) {
      throw new Error(`Failed to read file: ${error.message}`);
    }
  });
}
```

#### 3. 가상화를 통한 대용량 목록 렌더링

많은 파일이 있는 디렉토리를 효율적으로 렌더링하기 위해 가상화를 구현합니다:

```typescript
import React, { useState, useMemo, useCallback } from 'react';

interface VirtualizedFileListProps {
  items: FileItem[];
  onItemClick: (item: FileItem) => void;
}

const VirtualizedFileList: React.FC<VirtualizedFileListProps> = ({
  items,
  onItemClick
}) => {
  const [scrollTop, setScrollTop] = useState(0);
  const [containerHeight, setContainerHeight] = useState(400);
  
  const ITEM_HEIGHT = 40;
  const BUFFER_SIZE = 5; // 버퍼 아이템 수

  const visibleItems = useMemo(() => {
    const startIndex = Math.max(0, Math.floor(scrollTop / ITEM_HEIGHT) - BUFFER_SIZE);
    const endIndex = Math.min(
      items.length,
      Math.ceil((scrollTop + containerHeight) / ITEM_HEIGHT) + BUFFER_SIZE
    );

    return items.slice(startIndex, endIndex).map((item, index) => ({
      ...item,
      index: startIndex + index
    }));
  }, [items, scrollTop, containerHeight]);

  const handleScroll = useCallback((event: React.UIEvent<HTMLDivElement>) => {
    setScrollTop(event.currentTarget.scrollTop);
  }, []);

  const totalHeight = items.length * ITEM_HEIGHT;

  return (
    <div
      className="virtualized-list"
      style={{ height: containerHeight, overflow: 'auto' }}
      onScroll={handleScroll}
    >
      <div style={{ height: totalHeight, position: 'relative' }}>
        {visibleItems.map((item) => (
          <div
            key={item.path}
            className="file-item"
            style={{
              position: 'absolute',
              top: item.index * ITEM_HEIGHT,
              height: ITEM_HEIGHT,
              left: 0,
              right: 0,
            }}
            onClick={() => onItemClick(item)}
          >
            <span className="file-icon">
              {item.isDirectory ? '📁' : '📄'}
            </span>
            <span className="file-name">{item.name}</span>
          </div>
        ))}
      </div>
    </div>
  );
};
```

### 렌더링 성능 최적화

#### 1. React.memo와 useMemo 활용

```typescript
import React, { memo, useMemo } from 'react';

interface FileItemProps {
  item: FileItem;
  onSelect: (item: FileItem) => void;
  isSelected: boolean;
}

const FileItemComponent = memo<FileItemProps>(({ item, onSelect, isSelected }) => {
  const icon = useMemo(() => {
    return item.isDirectory ? '📁' : getFileIcon(item.name);
  }, [item.isDirectory, item.name]);

  const handleClick = useCallback(() => {
    onSelect(item);
  }, [item, onSelect]);

  return (
    <div
      className={`file-item ${isSelected ? 'selected' : ''}`}
      onClick={handleClick}
    >
      <span className="file-icon">{icon}</span>
      <span className="file-name">{item.name}</span>
    </div>
  );
});

// 파일 아이콘 캐싱
const iconCache = new Map<string, string>();

const getFileIcon = (fileName: string): string => {
  const extension = fileName.toLowerCase().split('.').pop() || '';
  
  if (iconCache.has(extension)) {
    return iconCache.get(extension)!;
  }

  const icon = determineFileIcon(extension);
  iconCache.set(extension, icon);
  return icon;
};
```

#### 2. 디바운싱과 스로틀링

사용자 입력이나 스크롤 이벤트를 최적화합니다:

```typescript
import { useState, useCallback, useRef } from 'react';

const useDebounce = <T extends (...args: any[]) => any>(
  callback: T,
  delay: number
) => {
  const timeoutRef = useRef<NodeJS.Timeout>();

  return useCallback((...args: Parameters<T>) => {
    if (timeoutRef.current) {
      clearTimeout(timeoutRef.current);
    }

    timeoutRef.current = setTimeout(() => {
      callback(...args);
    }, delay);
  }, [callback, delay]);
};

const SearchInput: React.FC<{ onSearch: (query: string) => void }> = ({ onSearch }) => {
  const [query, setQuery] = useState('');
  
  const debouncedSearch = useDebounce((searchQuery: string) => {
    onSearch(searchQuery);
  }, 300);

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const value = e.target.value;
    setQuery(value);
    debouncedSearch(value);
  };

  return (
    <input
      type="text"
      value={query}
      onChange={handleInputChange}
      placeholder="파일 검색..."
    />
  );
};
```

### 앱 시작 시간 최적화

#### 1. 지연 로딩 구현

```typescript
import React, { Suspense, lazy } from 'react';

// 컴포넌트 지연 로딩
const FileEditor = lazy(() => import('./components/FileEditor'));
const PreferencesDialog = lazy(() => import('./components/PreferencesDialog'));

const App: React.FC = () => {
  return (
    <div className="app">
      <Suspense fallback={<div>로딩 중...</div>}>
        <FileEditor />
      </Suspense>
    </div>
  );
};
```

#### 2. 초기 렌더링 최적화

```typescript
private createMainWindow(): void {
  this.mainWindow = new BrowserWindow({
    width: 1200,
    height: 800,
    show: false, // 초기에는 숨김
    webPreferences: {
      nodeIntegration: false,
      contextIsolation: true,
      preload: path.join(__dirname, 'preload.js'),
      backgroundThrottling: false, // 백그라운드에서도 성능 유지
    },
  });

  // 스플래시 스크린 표시
  const splash = new BrowserWindow({
    width: 400,
    height: 300,
    frame: false,
    alwaysOnTop: true,
    transparent: true,
    webPreferences: {
      nodeIntegration: false
    }
  });

  splash.loadFile(path.join(__dirname, 'splash.html'));

  // 메인 창 로드 완료 시 스플래시 숨기고 메인 창 표시
  this.mainWindow.once('ready-to-show', () => {
    splash.close();
    this.mainWindow?.show();
  });

  this.mainWindow.loadURL(startUrl);
}
```

### 성능 모니터링

앱의 성능을 지속적으로 모니터링하기 위한 시스템을 구현합니다:

```typescript
class PerformanceMonitor {
  private metrics: Map<string, number[]> = new Map();

  startTimer(label: string): () => void {
    const start = performance.now();
    
    return () => {
      const duration = performance.now() - start;
      this.recordMetric(label, duration);
    };
  }

  recordMetric(label: string, value: number): void {
    if (!this.metrics.has(label)) {
      this.metrics.set(label, []);
    }
    
    const values = this.metrics.get(label)!;
    values.push(value);
    
    // 최근 100개 값만 유지
    if (values.length > 100) {
      values.shift();
    }
  }

  getAverageMetric(label: string): number {
    const values = this.metrics.get(label);
    if (!values || values.length === 0) return 0;
    
    return values.reduce((sum, value) => sum + value, 0) / values.length;
  }

  logPerformanceReport(): void {
    console.log('성능 리포트:');
    for (const [label, values] of this.metrics) {
      const avg = this.getAverageMetric(label);
      console.log(`${label}: 평균 ${avg.toFixed(2)}ms`);
    }
  }
}

// 사용 예시
const monitor = new PerformanceMonitor();

const handleFileRead = async (filePath: string) => {
  const endTimer = monitor.startTimer('file-read');
  
  try {
    const content = await window.electronAPI.readFile(filePath);
    return content;
  } finally {
    endTimer();
  }
};

// 주기적 성능 리포트
setInterval(() => {
  monitor.logPerformanceReport();
}, 60000); // 1분마다
```

## 마무리

이 가이드를 통해 웹 개발자가 Electron을 활용하여 프로덕션 품질의 데스크톱 애플리케이션을 개발하는 전 과정을 살펴보았습니다. 단순한 튜토리얼을 넘어서 실무에서 마주치게 될 다양한 상황들과 해결책들을 함께 다뤘습니다.

핵심 포인트를 정리하면 다음과 같습니다:

**개발 환경**: TypeScript와 React를 활용한 현대적인 개발 환경을 구성하고, Main Process와 Renderer Process의 역할을 명확히 구분하여 안정적인 아키텍처를 설계해야 합니다.

**보안**: contextIsolation과 preload script를 통한 안전한 API 설계, 입력 검증, 권한 관리 등이 필수적입니다. 보안은 개발 초기부터 고려되어야 하며, 나중에 추가하기 어려운 영역입니다.

**성능**: 메모리 관리, 가상화, 지연 로딩 등을 통해 사용자 경험을 개선할 수 있습니다. 특히 대용량 데이터를 다루는 앱에서는 성능 최적화가 매우 중요합니다.

**배포**: 각 플랫폼별 특성을 이해하고 적절한 빌드 설정과 코드 사이닝을 통해 사용자가 신뢰할 수 있는 앱을 배포해야 합니다.

Electron은 분명히 네이티브 앱 대비 메모리 사용량이나 성능 면에서 단점이 있지만, 개발 효율성과 크로스 플랫폼 호환성이라는 강력한 장점을 제공합니다. 특히 웹 개발 경험이 있는 개발자라면 상대적으로 적은 학습 비용으로 데스크톱 앱 개발에 진입할 수 있습니다.

앞으로 Electron을 활용한 프로젝트를 시작하신다면, 이 가이드에서 다룬 베스트 프랙티스들을 참고하여 안정적이고 성능이 우수한 앱을 개발하시기 바랍니다. 무엇보다 사용자 경험을 최우선으로 고려하고, 지속적인 성능 모니터링과 최적화를 통해 품질 높은 앱을 만들어 나가시길 바랍니다.