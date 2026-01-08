import { useState, useEffect } from 'react';
import Editor from '@monaco-editor/react';
import { Save, FileCode, CheckCircle, AlertCircle, RefreshCw, Trash2, Plus } from 'lucide-react';
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

const FileTreeItem = ({ name, isSelected, onClick, onDelete, isAdmin }) => (
    <div className={`w-full flex items-center gap-2 mb-1 p-2 rounded-lg text-sm transition-all group ${isSelected
        ? 'bg-primary-500/20 text-primary-400 border border-primary-500/20'
        : 'text-gray-400 hover:bg-white/5 hover:text-gray-200'
        }`}>
        <button className="flex-1 flex items-center gap-2 text-left truncate" onClick={onClick}>
            <FileCode size={16} />
            <span className="truncate" dir="ltr">{name}</span>
        </button>
        {isAdmin && (
            <button
                onClick={(e) => { e.stopPropagation(); onDelete(); }}
                className="opacity-0 group-hover:opacity-100 text-red-500 hover:bg-red-500/10 p-1 rounded transition-all"
                title="Delete File"
            >
                <Trash2 size={12} />
            </button>
        )}
    </div>
);

const LiveCodeEditor = ({ project, userRole = 'user' }) => {
    const [files, setFiles] = useState({});
    const [selectedFile, setSelectedFile] = useState(null);
    const [originalContent, setOriginalContent] = useState('');
    const [code, setCode] = useState('');
    const [saving, setSaving] = useState(false);
    const [status, setStatus] = useState(null);

    // File creation state
    const [showNewFile, setShowNewFile] = useState(false);
    const [newFileName, setNewFileName] = useState('');

    const isAdmin = userRole === 'admin';

    useEffect(() => {
        if (project?.files) {
            setFiles(project.files);
            if (!selectedFile) {
                const firstFile = Object.keys(project.files)[0];
                if (firstFile) {
                    // Manually selecting to avoid dependency cycle
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
            setFiles(newFiles);
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
        setOriginalContent(code); // update local original
        await persistChanges(updatedFiles);
    };

    const handleCreateFile = async (e) => {
        e.preventDefault();
        if (!newFileName.trim()) return;

        const fileName = newFileName.trim();
        if (files[fileName]) {
            alert('File already exists!');
            return;
        }

        const newFiles = { ...files, [fileName]: '// New file' };
        await persistChanges(newFiles);
        setNewFileName('');
        setShowNewFile(false);
        selectFile(fileName, '// New file');
    };

    const handleDeleteFile = async (fileName) => {
        if (!window.confirm(`Are you sure you want to delete ${fileName}?`)) return;

        const newFiles = { ...files };
        delete newFiles[fileName];
        await persistChanges(newFiles);

        if (selectedFile === fileName) {
            setSelectedFile(null);
            setCode('');
        }
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
                        <span>Explorer</span>
                        {isAdmin && (
                            <button
                                onClick={() => setShowNewFile(!showNewFile)}
                                className="text-gray-400 hover:text-white p-1 hover:bg-white/10 rounded"
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
                                placeholder="filename.js"
                                className="w-full bg-[#333] text-white text-xs p-2 rounded border border-gray-600 outline-none focus:border-primary-500"
                            />
                        </form>
                    )}

                    <div className="flex-1 overflow-y-auto p-2">
                        {Object.entries(files).map(([name, content]) => (
                            <FileTreeItem
                                key={name}
                                name={name}
                                isAdmin={isAdmin}
                                isSelected={name === selectedFile}
                                onClick={() => selectFile(name, content)}
                                onDelete={() => handleDeleteFile(name)}
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
