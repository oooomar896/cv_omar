import { useState, useEffect } from 'react';
import Editor from '@monaco-editor/react';
import { Save, FileCode, CheckCircle, RefreshCw, Trash2, Plus, ChevronDown, ChevronRight, Folder, Play, Code2 } from 'lucide-react';
import { dataService } from '../../utils/dataService';
import toast from 'react-hot-toast';

const getLanguageFromExt = (filename) => {
    const ext = filename.split('.').pop();
    switch (ext) {
        case 'js': return 'javascript';
        case 'jsx': return 'javascript';
        case 'ts': return 'typescript';
        case 'tsx': return 'typescript';
        case 'html': return 'html';
        case 'css': return 'css';
        case 'json': return 'json';
        case 'py': return 'python';
        case 'sql': return 'sql';
        default: return 'plaintext';
    }
};

// Helper to build tree from flat paths
const buildFileTree = (files) => {
    const root = {};
    Object.keys(files).forEach(path => {
        const parts = path.split('/');
        let current = root;
        parts.forEach((part, index) => {
            if (!current[part]) {
                current[part] = index === parts.length - 1 ? { _file: true, content: files[path] } : {};
            }
            current = current[part];
        });
    });
    return root;
};

const FileTreeNode = ({ name, node, path, selectedFile, onSelect, onDelete, isAdmin, depth = 0 }) => {
    const [expanded, setExpanded] = useState(true);
    const isFile = node._file;
    const isSelected = path === selectedFile;

    if (isFile) {
        return (
            <div
                role="button"
                tabIndex={0}
                className={`flex items-center gap-2 mb-1 p-1.5 rounded-lg text-xs transition-all cursor-pointer group ${isSelected ? 'bg-primary-500/20 text-primary-400' : 'text-gray-400 hover:bg-white/5 hover:text-gray-200'
                    }`}
                style={{ paddingLeft: `${depth * 12 + 12}px` }}
                onClick={() => onSelect(path, node.content)}
                onKeyDown={(e) => e.key === 'Enter' && onSelect(path, node.content)}
            >
                <div className="flex items-center justify-center w-4 h-4 shrink-0">
                    {name.endsWith('.html') ? <Code2 size={14} className="text-orange-500" /> :
                        name.endsWith('.css') ? <FileCode size={14} className="text-blue-400" /> :
                            name.endsWith('.js') || name.endsWith('.jsx') ? <FileCode size={14} className="text-yellow-400" /> :
                                <FileCode size={14} />}
                </div>
                <span className="truncate flex-1">{name}</span>
                {isAdmin && (
                    <button
                        onClick={(e) => { e.stopPropagation(); onDelete(path); }}
                        className="opacity-0 group-hover:opacity-100 text-red-500 hover:bg-red-500/10 p-1 rounded"
                    >
                        <Trash2 size={12} />
                    </button>
                )}
            </div>
        );
    }

    return (
        <div>
            <div
                role="button"
                tabIndex={0}
                className="flex items-center gap-2 mb-1 p-1.5 rounded-lg text-xs text-gray-500 hover:text-gray-300 cursor-pointer select-none"
                style={{ paddingLeft: `${depth * 12 + 4}px` }}
                onClick={() => setExpanded(!expanded)}
                onKeyDown={(e) => e.key === 'Enter' && setExpanded(!expanded)}
            >
                {expanded ? <ChevronDown size={14} /> : <ChevronRight size={14} />}
                <Folder size={14} className="text-amber-500/80" />
                <span className="font-bold truncate">{name}</span>
            </div>
            {expanded && (
                <div>
                    {Object.entries(node).map(([childName, childNode]) => (
                        <FileTreeNode
                            key={childName}
                            name={childName}
                            node={childNode}
                            path={`${path ? path + '/' : ''}${childName}`}
                            selectedFile={selectedFile}
                            onSelect={onSelect}
                            onDelete={onDelete}
                            isAdmin={isAdmin}
                            depth={depth + 1}
                        />
                    ))}
                </div>
            )}
        </div>
    );
};

// Helper to generate preview HTML
const generatePreview = (files) => {
    let html = files['index.html'] || files['src/index.html'] || '<div style="color:white;font-family:sans-serif;text-align:center;padding:20px">No index.html found</div>';

    // Inject CSS
    const cssFiles = Object.keys(files).filter(f => f.endsWith('.css'));
    let styles = '';
    cssFiles.forEach(f => {
        styles += `<style>/* ${f} */ \n${files[f]}</style>\n`;
    });

    // Inject JS
    const jsFiles = Object.keys(files).filter(f => f.endsWith('.js') && !f.includes('test'));
    let scripts = '';
    jsFiles.forEach(f => {
        scripts += `<script>try{ \n${files[f]}\n }catch(e){console.error(e)}</script>\n`;
    });

    // Basic replacements to inject style and scripts
    if (html.includes('</head>')) {
        html = html.replace('</head>', `${styles}</head>`);
    } else {
        html += styles;
    }

    if (html.includes('</body>')) {
        html = html.replace('</body>', `${scripts}</body>`);
    } else {
        html += scripts;
    }

    return html;
};

const TabItem = ({ name, isActive, onClick, onClose }) => (
    <div
        role="button"
        tabIndex={0}
        onKeyDown={(e) => e.key === 'Enter' && onClick()}
        className={`flex items-center gap-2 px-3 py-2 text-xs border-r border-[#1e1e1e] cursor-pointer transition-colors min-w-[120px] max-w-[200px] ${isActive ? 'bg-[#1e1e1e] text-white border-t-2 border-t-blue-500' : 'bg-[#2d2d2d] text-gray-500 hover:bg-[#252526]'
            }`}
        onClick={onClick}
    >
        <div className="flex items-center justify-center w-3 h-3">
            {name.endsWith('.html') ? <Code2 size={12} className="text-orange-500" /> :
                name.endsWith('.css') ? <FileCode size={12} className="text-blue-400" /> :
                    name.endsWith('.js') || name.endsWith('.jsx') ? <FileCode size={12} className="text-yellow-400" /> :
                        <FileCode size={12} />}
        </div>
        <span className="truncate">{name.split('/').pop()}</span>
        <button
            onClick={(e) => { e.stopPropagation(); onClose(); }}
            className="p-0.5 rounded-sm hover:bg-white/20 opacity-0 group-hover:opacity-100"
            aria-label="Close tab"
        >
            <div className="text-[10px]">✕</div>
        </button>
    </div>
);

const LiveCodeEditor = ({ project, userRole = 'user' }) => {
    // State
    const [files, setFiles] = useState({});
    const [openFiles, setOpenFiles] = useState([]);
    const [selectedFile, setSelectedFile] = useState(null);
    const [code, setCode] = useState('');
    const [mode, setMode] = useState('code'); // 'code' or 'preview'
    const [saving, setSaving] = useState(false);

    // UI State
    const [activePanel, setActivePanel] = useState('explorer'); // 'explorer', 'git'
    const [showNewFile, setShowNewFile] = useState(false);
    const [newFileName, setNewFileName] = useState('');
    const [fileTree, setFileTree] = useState({});

    // Git State
    const [gitMessage, setGitMessage] = useState('');

    const isAdmin = userRole === 'admin';

    useEffect(() => {
        if (project?.files) {
            setFiles(project.files);
            setFileTree(buildFileTree(project.files));

            if (openFiles.length === 0) {
                const firstFile = Object.keys(project.files).find(f => f.endsWith('.html')) || Object.keys(project.files)[0];
                if (firstFile) {
                    openFile(firstFile);
                }
            }
        }
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [project]);

    const openFile = (fileName) => {
        if (!openFiles.includes(fileName)) {
            setOpenFiles([...openFiles, fileName]);
        }
        selectFile(fileName);
        setMode('code');
    };

    const closeFile = (fileName) => {
        const newOpen = openFiles.filter(f => f !== fileName);
        setOpenFiles(newOpen);
        if (selectedFile === fileName) {
            if (newOpen.length > 0) {
                selectFile(newOpen[newOpen.length - 1]);
            } else {
                setSelectedFile(null);
                setCode('');
            }
        }
    };

    const selectFile = (fileName) => {
        if (!files[fileName]) return;
        setSelectedFile(fileName);
        const content = files[fileName];
        setCode(typeof content === 'string' ? content : JSON.stringify(content, null, 2));
    };

    const handleCreateFile = async (e) => {
        e.preventDefault();
        if (!newFileName.trim()) return;
        const fileName = newFileName.trim().replace(/^\/+/, '');
        if (files[fileName]) { toast.error('File exists!'); return; }
        const newFiles = { ...files, [fileName]: fileName.endsWith('.html') ? '<!DOCTYPE html>\n<html>\n<body>\n  <h1>Hello</h1>\n</body>\n</html>' : '' };
        await persistChanges(newFiles);
        setNewFileName('');
        setShowNewFile(false);
        openFile(fileName);
    };

    const handleDeleteFile = async (fileName) => {
        if (!window.confirm(`Delete ${fileName}?`)) return;
        const newFiles = { ...files };
        delete newFiles[fileName];
        await persistChanges(newFiles);
        closeFile(fileName);
    };

    const persistChanges = async (newFiles) => {
        setSaving(true);
        try {
            await dataService.updateGeneratedProject(project.id, { files: newFiles });
            setFiles(newFiles);
            setFileTree(buildFileTree(newFiles));
        } catch (error) {
            console.error(error);
        } finally {
            setSaving(false);
        }
    };

    const handleSave = async () => {
        if (!selectedFile) return;
        const updatedFiles = { ...files, [selectedFile]: code };
        await persistChanges(updatedFiles);
    };

    const handleGitCommit = async () => {
        if (!gitMessage.trim()) {
            toast.error('Please enter a commit message');
            return;
        }
        setSaving(true);
        // Simulate commit by just saving current state with a "commit" status
        await persistChanges(files);
        setGitMessage('');
        toast.success('Changes committed successfully!');
        setSaving(false);
    };

    return (
        <div className="flex h-[750px] bg-[#1e1e1e] border border-gray-800 rounded-xl overflow-hidden shadow-2xl font-sans text-sm" dir="ltr">
            {/* 1. Activity Bar (Left Strip) */}
            <div className="w-12 bg-[#333333] flex flex-col items-center py-4 gap-4 border-r border-[#1e1e1e] shrink-0">
                <button
                    onClick={() => setActivePanel('explorer')}
                    className={`p-3 rounded-md transition-all relative group ${activePanel === 'explorer' ? 'text-white' : 'text-gray-500 hover:text-white'}`}
                    title="Explorer"
                >
                    <Folder size={24} strokeWidth={1.5} />
                    {activePanel === 'explorer' && <div className="absolute left-0 top-2 bottom-2 w-1 bg-white rounded-r"></div>}
                </button>
                <button
                    onClick={() => setActivePanel('git')}
                    className={`p-3 rounded-md transition-all relative group ${activePanel === 'git' ? 'text-white' : 'text-gray-500 hover:text-white'}`}
                    title="Source Control"
                >
                    <div className="relative">
                        <Code2 size={24} strokeWidth={1.5} />
                        <div className="absolute -top-1 -right-1 w-2.5 h-2.5 bg-blue-500 rounded-full border-2 border-[#333]"></div>
                    </div>
                    {activePanel === 'git' && <div className="absolute left-0 top-2 bottom-2 w-1 bg-white rounded-r"></div>}
                </button>

                <div className="flex-1"></div>
                <button className="p-3 text-gray-500 hover:text-white"><RefreshCw size={20} strokeWidth={1.5} /></button>
            </div>

            {/* 2. Side Panel (Explorer or Git) */}
            <div className="w-64 bg-[#252526] flex flex-col border-r border-[#1e1e1e] shrink-0">
                <div className="h-9 px-4 flex items-center text-xs font-bold text-gray-400 uppercase tracking-wider bg-[#252526]">
                    {activePanel === 'explorer' ? 'Explorer' : 'Source Control'}
                </div>

                {activePanel === 'explorer' && (
                    <div className="flex-1 flex flex-col overflow-hidden">
                        <div className="px-2 py-1 flex items-center justify-between text-xs font-bold text-white bg-[#333] cursor-pointer">
                            <span className="flex items-center gap-1"><ChevronDown size={14} /> {project?.name || 'PROJECT'}</span>
                            {isAdmin && (
                                <button onClick={() => setShowNewFile(!showNewFile)} className="hover:bg-white/20 p-1 rounded"><Plus size={14} /></button>
                            )}
                        </div>

                        {showNewFile && (
                            <form onSubmit={handleCreateFile} className="p-2 bg-black/20 border-b border-[#333]">
                                <input
                                    type="text"
                                    value={newFileName}
                                    onChange={(e) => setNewFileName(e.target.value)}
                                    placeholder="src/app.js"
                                    className="w-full bg-[#333] text-white text-xs p-1.5 rounded border border-gray-600 outline-none focus:border-blue-500"
                                />
                            </form>
                        )}

                        <div className="flex-1 overflow-y-auto p-2">
                            {Object.entries(fileTree).map(([name, node]) => (
                                <FileTreeNode
                                    key={name} name={name} node={node} path={name}
                                    selectedFile={selectedFile} onSelect={(p) => openFile(p)} onDelete={handleDeleteFile} isAdmin={isAdmin}
                                />
                            ))}
                        </div>
                    </div>
                )}

                {activePanel === 'git' && (
                    <div className="flex-1 flex flex-col p-3 gap-4">
                        <div className="flex items-center justify-between">
                            <span className="text-xs font-bold text-gray-400">SOURCE CONTROL</span>
                            <div className="flex gap-2">
                                <button className="hover:text-white text-gray-500"><Play size={14} /></button>
                                <button className="hover:text-white text-gray-500"><RefreshCw size={14} /></button>
                            </div>
                        </div>

                        <div className="flex flex-col gap-2">
                            <textarea
                                value={gitMessage}
                                onChange={(e) => setGitMessage(e.target.value)}
                                placeholder="Message (Enter to commit on Ctrl+Enter)"
                                className="w-full h-20 bg-[#3c3c3c] text-white text-xs p-2 rounded border border-gray-600 outline-none focus:border-blue-500 resize-none placeholder-gray-500"
                            />
                            <button
                                onClick={handleGitCommit}
                                disabled={saving}
                                className="w-full bg-blue-600 hover:bg-blue-500 text-white py-1.5 rounded text-xs font-bold flex items-center justify-center gap-2"
                            >
                                {saving ? <RefreshCw size={14} className="animate-spin" /> : <CheckCircle size={14} />}
                                Commit & Push
                            </button>
                        </div>

                        <div className="mt-4">
                            <span className="text-xs font-bold text-gray-400 block mb-2">Changes</span>
                            <div className="text-gray-500 text-xs italic text-center py-4 bg-white/5 rounded">
                                No unsaved changes detected
                            </div>
                        </div>
                    </div>
                )}
            </div>

            {/* 3. Main Editor Area */}
            <div className="flex-1 flex flex-col bg-[#1e1e1e] min-w-0">
                {/* Tabs */}
                <div className="flex h-9 bg-[#2d2d2d] overflow-x-auto no-scrollbar">
                    {openFiles.map(file => (
                        <TabItem
                            key={file}
                            name={file}
                            isActive={selectedFile === file && mode === 'code'}
                            onClick={() => openFile(file)}
                            onClose={() => closeFile(file)}
                        />
                    ))}
                </div>

                {/* Toolbar (Breadcrumbs + Actions) */}
                <div className="h-8 bg-[#1e1e1e] border-b border-[#2d2d2d] flex items-center justify-between px-4">
                    <div className="flex items-center gap-2 text-xs text-gray-500">
                        <span>{project?.name}</span>
                        <ChevronRight size={12} />
                        <span className="text-white">{selectedFile || '...'}</span>
                    </div>
                    <div className="flex items-center gap-2">
                        <button
                            onClick={() => setMode(mode === 'preview' ? 'code' : 'preview')}
                            className={`p-1 rounded hover:bg-[#333] ${mode === 'preview' ? 'text-blue-400' : 'text-gray-400'}`}
                            title="Toggle Preview"
                        >
                            <Play size={16} />
                        </button>
                        <button onClick={handleSave} className="p-1 rounded hover:bg-[#333] text-gray-400 hover:text-white" title="Save">
                            <Save size={16} />
                        </button>
                    </div>
                </div>

                {/* Editor / Preview Content */}
                <div className="flex-1 relative">
                    {mode === 'preview' ? (
                        <div className="w-full h-full bg-white">
                            <iframe
                                title="preview"
                                srcDoc={generatePreview(files)}
                                className="w-full h-full border-0"
                                sandbox="allow-scripts"
                            />
                        </div>
                    ) : (
                        selectedFile ? (
                            <Editor
                                height="100%"
                                defaultLanguage="javascript"
                                language={getLanguageFromExt(selectedFile)}
                                value={code}
                                theme="vs-dark"
                                onChange={(val) => { setCode(val); }}
                                options={{
                                    minimap: { enabled: true },
                                    fontSize: 14,
                                    lineHeight: 21,
                                    wordWrap: 'on',
                                    padding: { top: 16 },
                                    fontFamily: 'Fira Code, monospace',
                                    fontLigatures: true,
                                }}
                            />
                        ) : (
                            <div className="flex flex-col items-center justify-center h-full text-gray-600 gap-4 select-none">
                                <Code2 size={64} className="opacity-10" />
                                <div className="text-center">
                                    <h3 className="text-sm font-medium text-gray-500">Select a file to start editing</h3>
                                    <p className="text-xs opacity-60 mt-2">⌘P to search files</p>
                                </div>
                            </div>
                        )
                    )}
                </div>

                {/* Status Bar */}
                <div className="h-6 bg-[#007acc] text-white flex items-center justify-between px-3 text-[10px] select-none">
                    <div className="flex items-center gap-3">
                        <span className="flex items-center gap-1"><div className="w-2 h-2 rounded-full bg-white"></div> main*</span>
                        <span className="flex items-center gap-1"><RefreshCw size={10} /> 0</span>
                    </div>
                    <div className="flex items-center gap-4">
                        <span>Ln {code.split('\n').length}, Col 1</span>
                        <span>UTF-8</span>
                        <span>JavaScript React</span>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default LiveCodeEditor;
