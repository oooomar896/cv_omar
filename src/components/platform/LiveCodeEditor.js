import { useState, useEffect } from 'react';
import Editor from '@monaco-editor/react';
import { Save, FileCode, CheckCircle, AlertCircle, RefreshCw, Trash2, Plus, ChevronDown, ChevronRight, Folder } from 'lucide-react';
import { dataService } from '../../utils/dataService';

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
    const hasChildren = !isFile && Object.keys(node).length > 0;

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
                <FileCode size={14} className="shrink-0" />
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

const LiveCodeEditor = ({ project, userRole = 'user' }) => {
    // ... code for state hooks ...
    const [files, setFiles] = useState({});
    const [selectedFile, setSelectedFile] = useState(null);
    const [code, setCode] = useState('');
    const [originalContent, setOriginalContent] = useState('');
    const [status, setStatus] = useState(null);
    const [saving, setSaving] = useState(false);

    // File creation
    const [showNewFile, setShowNewFile] = useState(false);
    const [newFileName, setNewFileName] = useState('');

    // Derived Tree
    const [fileTree, setFileTree] = useState({});

    const isAdmin = userRole === 'admin';

    useEffect(() => {
        if (project?.files) {
            setFiles(project.files);
            setFileTree(buildFileTree(project.files));

            // Auto select logic
            if (!selectedFile) {
                const firstFile = Object.keys(project.files)[0];
                if (firstFile) {
                    const content = project.files[firstFile];
                    setSelectedFile(firstFile);
                    const fileContent = typeof content === 'string' ? content : JSON.stringify(content, null, 2);
                    setCode(fileContent);
                    setOriginalContent(fileContent);
                }
            }
        }
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [project]);

    // ... helper functions persistChanges, handleSave, handleEditorChange ...

    // Updated Create File to rebuild tree
    const handleCreateFile = async (e) => {
        e.preventDefault();
        if (!newFileName.trim()) return;

        // Normalize path (remove leading slash)
        const fileName = newFileName.trim().replace(/^\/+/, '');

        if (files[fileName]) {
            alert('File already exists!');
            return;
        }

        const newFiles = { ...files, [fileName]: '// New file' };

        // Optimistic UI update
        setFiles(newFiles);
        setFileTree(buildFileTree(newFiles));

        await persistChanges(newFiles);

        setNewFileName('');
        setShowNewFile(false);
        selectFile(fileName, '// New file');
    };

    // Updated delete file to rebuild tree
    const handleDeleteFile = async (fileName) => {
        if (!window.confirm(`Delete ${fileName}?`)) return;

        const newFiles = { ...files };
        delete newFiles[fileName];

        setFiles(newFiles);
        setFileTree(buildFileTree(newFiles));

        await persistChanges(newFiles);

        if (selectedFile === fileName) {
            setSelectedFile(null);
            setCode('');
        }
    };

    // Keep existing selectFile, handleEditorChange, handleSave, persistChanges... (need to ensure they are available in scope or redefined)

    const selectFile = (fileName, content) => {
        setSelectedFile(fileName);
        const fileContent = typeof content === 'string' ? content : JSON.stringify(content, null, 2);
        setCode(fileContent);
        setOriginalContent(fileContent);
    };

    const handleEditorChange = (value) => {
        setCode(value);
        if (status) setStatus(null);
    };

    const persistChanges = async (newFiles) => {
        setSaving(true);
        try {
            await dataService.updateGeneratedProject(project.id, { files: newFiles });
            setStatus('success');
            setTimeout(() => setStatus(null), 3000);
        } catch (error) {
            console.error(error);
            setStatus('error');
        } finally {
            setSaving(false);
        }
    };

    const handleSave = async () => {
        if (!selectedFile) return;
        const updatedFiles = { ...files, [selectedFile]: code };
        setOriginalContent(code);
        await persistChanges(updatedFiles);
    };

    const hasChanges = code !== originalContent;

    return (
        <div className="flex flex-col h-[700px] bg-[#1e1e1e] border border-gray-800 rounded-2xl overflow-hidden font-sans" dir="ltr">
            {/* Toolbar */}
            <div className="flex items-center justify-between p-3 bg-[#252526] border-b border-[#333]">
                <div className="flex items-center gap-3">
                    <span className="text-gray-400 text-xs font-mono uppercase bg-black/20 px-2 py-1 rounded">
                        {selectedFile || 'No file selected'}
                    </span>
                    {hasChanges && <div className="w-2 h-2 rounded-full bg-yellow-500 animate-pulse"></div>}
                </div>

                <div className="flex items-center gap-3">
                    {status === 'success' && <span className="text-green-500 text-xs flex items-center gap-1"><CheckCircle size={14} /> Saved</span>}
                    {status === 'error' && <span className="text-red-500 text-xs flex items-center gap-1"><AlertCircle size={14} /> Error</span>}

                    <button
                        onClick={handleSave}
                        disabled={!hasChanges || saving}
                        className={`flex items-center gap-2 px-4 py-1.5 rounded-lg text-xs font-bold transition-all ${hasChanges
                            ? 'bg-primary-600 hover:bg-primary-500 text-white'
                            : 'bg-white/5 text-gray-500 cursor-not-allowed'
                            }`}
                    >
                        {saving ? <RefreshCw size={14} className="animate-spin" /> : <Save size={14} />}
                        Save Changes
                    </button>
                </div>
            </div>

            <div className="flex flex-1 overflow-hidden">
                {/* File Explorer */}
                <div className="w-64 bg-[#1e1e1e] border-r border-[#333] flex flex-col">
                    <div className="p-3 bg-[#252526] text-xs font-bold text-gray-500 uppercase tracking-wider flex items-center justify-between">
                        <span>Project Files</span>
                        {isAdmin && (
                            <button
                                onClick={() => setShowNewFile(!showNewFile)}
                                className="text-gray-400 hover:text-white p-1 hover:bg-white/10 rounded"
                                title="New File (use / for folders)"
                            >
                                <Plus size={14} />
                            </button>
                        )}
                    </div>

                    {/* New File Input */}
                    {showNewFile && (
                        <form onSubmit={handleCreateFile} className="p-2 bg-black/20 border-b border-[#333]">
                            <input
                                type="text"
                                value={newFileName}
                                onChange={(e) => setNewFileName(e.target.value)}
                                placeholder="src/components/App.js"
                                className="w-full bg-[#333] text-white text-xs p-2 rounded border border-gray-600 outline-none focus:border-primary-500"
                            />
                            <p className="text-[10px] text-gray-500 mt-1">Use <code>/</code> to create folders</p>
                        </form>
                    )}

                    <div className="flex-1 overflow-y-auto p-2">
                        {Object.entries(fileTree).map(([name, node]) => (
                            <FileTreeNode
                                key={name}
                                name={name}
                                node={node}
                                path={name}
                                selectedFile={selectedFile}
                                onSelect={selectFile}
                                onDelete={handleDeleteFile}
                                isAdmin={isAdmin}
                            />
                        ))}
                    </div>
                </div>

                {/* Editor Area */}
                <div className="flex-1 bg-[#1e1e1e]">
                    {selectedFile ? (
                        <Editor
                            height="100%"
                            defaultLanguage="javascript"
                            language={getLanguageFromExt(selectedFile)}
                            value={code}
                            theme="vs-dark"
                            onChange={handleEditorChange}
                            options={{
                                minimap: { enabled: true },
                                fontSize: 14,
                                wordWrap: 'on',
                                automaticLayout: true,
                                padding: { top: 20 },
                                scrollBeyondLastLine: false,
                            }}
                        />
                    ) : (
                        <div className="flex items-center justify-center h-full text-gray-500 gap-2">
                            <FileCode size={40} className="opacity-20" />
                            <p>Select a file to edit</p>
                        </div>
                    )}
                </div>
            </div>
        </div>
    );
};

export default LiveCodeEditor;
