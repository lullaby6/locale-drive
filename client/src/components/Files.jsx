import { useState, useEffect, useRef } from 'react'
import { Search, File, Folder, EllipsisVertical, Download, Trash2, ExternalLink, Upload, XIcon } from 'lucide-react'

import { format } from "@formkit/tempo"

import {formatBytes} from '@/utils/file'

import "@/styles/global.css"

import { Toaster } from "@/utils/toaster/toaster.js"
import "@/utils/toaster/toaster.css"

const MODE = import.meta.env.PUBLIC_MODE
const API_URL = MODE === "DEV" ? "http://localhost:3000" : window.location.origin

export default () => {
    const [data, setData] = useState({});
    const [files, setFiles] = useState([]);
    const [storagePath, setStoragePath] = useState("");

    const [query, setQuery] = useState("");

    const inputFilesRef = useRef(null);

    useEffect(() => {

    }, [])

    async function getFiles() {
        try {
            let url = `${API_URL}/files`

            if (query && query.trim() !== "") url += `?q=${query}`

            const response = await fetch(url);

            if (!response.ok) {
                let message = "Error getting files"

                try {
                    const responseData = await response.json();

                    message = responseData.message
                } catch (error) {}

                throw new Error(message)
            }

            const responseData = await response.json();

            setData(responseData);

            setFiles(responseData.files.map(file => {
                return {
                    ...file,
                    modificationDate: new Date(file.modificationDate).toLocaleDateString() + " " + format(new Date(file.creationDate), "YYYY-MM-DD hh:mm").split(" ")[1],
                    creationDate: new Date(file.creationDate).toLocaleDateString(),
                    size: formatBytes(file.size),
                }
            }))

            setStoragePath(responseData.realPath)
        } catch (error) {
            new Toaster({
                type: "error",
                title: "Error getting file",
                text: error.message,
                position: 'bottom-right',
                pauseDurationOnHover: true,
                closeOnClick: true,
                closeOnDrag: true,
                progressBar: true,
                closeButton: {
                    onlyShowOnHover: true
                },
            })
        }

    }

    const [searchTimeout, setSearchTimeout] = useState(null);
    const searchTimeoutDuration = 500;
    const searchRef = useRef(null);

    async function handleSearch(event) {
        if (searchTimeout) {
            clearInterval(searchTimeout);
            setSearchTimeout(null);
        }

        setSearchTimeout(setTimeout(() => {
            const value = event.target.value.trim()

            setQuery(value);
        }, searchTimeoutDuration))
    }

    function clearQuery() {
        searchRef.current.value = "";

        if (searchTimeout) {
            clearInterval(searchTimeout);
            setSearchTimeout(null);
        }

        setQuery("");
    }

    useEffect(() => {
        getFiles();
    }, [query])

    async function deleteFile(fileName) {
        try {
            const response = await fetch(`${API_URL}/file/${fileName}`, {
                method: "DELETE"
            });

            if (response.ok) {
                await getFiles();

                new Toaster({
                    type: "success",
                    text: "File deleted successfully",
                    position: 'bottom-right',
                    pauseDurationOnHover: true,
                    closeOnClick: true,
                    closeOnDrag: true,
                    progressBar: true,
                    closeButton: {
                        onlyShowOnHover: true
                    },
                })

                return
            }

            let message = "Error deleting file"

            try {
                const responseData = await response.json();

                message = responseData.message
            } catch (error) {}

            throw new Error(message)
        } catch (error) {
            new Toaster({
                type: "error",
                title: "Error deleting file",
                text: error.message,
                position: 'bottom-right',
                pauseDurationOnHover: true,
                closeOnClick: true,
                closeOnDrag: true,
                progressBar: true,
                closeButton: {
                    onlyShowOnHover: true
                },
            })
        }
    }

    async function downloadFile(fileName) {
        try {
            const response = await fetch(`${API_URL}/download/${fileName}`);

            if (!response.ok) {
                let message = "Error downloading file"

                try {
                    const responseData = await response.json();

                    message = responseData.message
                } catch (error) {}

                throw new Error(message)
            }

            const buffer = await response.arrayBuffer();

            const a = document.createElement("a");
            const blob = new Blob([buffer]);
            a.href = URL.createObjectURL(blob);
            a.download = fileName;
            document.body.appendChild(a);
            a.click();
            a.remove();
        } catch (error) {
            new Toaster({
                type: "error",
                title: "Error downloading file",
                text: error.message,
                position: 'bottom-right',
                pauseDurationOnHover: true,
                closeOnClick: true,
                closeOnDrag: true,
                progressBar: true,
                closeButton: {
                    onlyShowOnHover: true
                },
            })
        }
    }

    const [debounceTimeouts, setDebounceTimeouts] = useState({});
    const debounceTimeoutDuration = 1000;

    async function renameFile(fileName, newFileName) {
        if (newFileName === fileName || newFileName.trim() === "") {
            return;
        }

        setDebounceTimeouts(prevTimeouts => {
            if (prevTimeouts[fileName]) {
                clearTimeout(prevTimeouts[fileName]);
            }

            const timeoutID = setTimeout(async () => {
                try {
                    const response = await fetch(`${API_URL}/rename/${fileName}`, {
                        method: "PUT",
                        headers: {
                            "Content-Type": "application/json"
                        },
                        body: JSON.stringify({
                            newFilename: newFileName
                        })
                    });

                    if (response.ok) {
                        await getFiles();

                        new Toaster({
                            type: "success",
                            text: "File renamed successfully",
                            position: 'bottom-right',
                            pauseDurationOnHover: true,
                            closeOnClick: true,
                            closeOnDrag: true,
                            progressBar: true,
                            closeButton: {
                                onlyShowOnHover: true
                            },
                        })

                        return
                    }

                    let message = "Error renaming file"

                    try {
                        const responseData = await response.json();

                        message = responseData.message
                    } catch (error) {}

                    throw new Error(message)
                } catch (error) {
                    new Toaster({
                        type: "error",
                        title: "Error renaming file",
                        text: error.message,
                        position: 'bottom-right',
                        pauseDurationOnHover: true,
                        closeOnClick: true,
                        closeOnDrag: true,
                        progressBar: true,
                        closeButton: {
                            onlyShowOnHover: true
                        },
                    })
                }
            }, debounceTimeoutDuration);

            return { ...prevTimeouts, [fileName]: timeoutID };
        });
    }

    async function upload() {
        const inputFile = inputFilesRef.current;

        inputFile.value = null;

        inputFile.click();
    }

    async function handleInputFilesChange(event) {
        const files = event.target.files;

        try {
            for (const file of files) {
                const formData = new FormData();
                formData.append("file", file);

                const response = await fetch(`${API_URL}/upload`, {
                    method: "POST",
                    body: formData
                });

                if (response.ok) {
                    await getFiles();

                    new Toaster({
                        type: "success",
                        text: "File uploaded successfully",
                        position: 'bottom-right',
                        pauseDurationOnHover: true,
                        closeOnClick: true,
                        closeOnDrag: true,
                        progressBar: true,
                        closeButton: {
                            onlyShowOnHover: true
                        },
                    })

                    return
                }

                let message = "Error uploading file"

                try {
                    const responseData = await response.json();

                    message = responseData.message
                } catch (error) {}

                throw new Error(message)
            }
        } catch (error) {
            new Toaster({
                type: "error",
                title: "Error uploading files",
                text: error.message,
                position: 'bottom-right',
                pauseDurationOnHover: true,
                closeOnClick: true,
                closeOnDrag: true,
                progressBar: true,
                closeButton: {
                    onlyShowOnHover: true
                },
            })
        }
    }

    useEffect(() => {
        getFiles()
    }, [])

    return (
        <div className="p-10 flex flex-col gap-4">
            <input onChange={handleInputFilesChange} ref={inputFilesRef} type="file" name="files" id="files" multiple className="hidden" />

            <div className='border border-neutral-200 p-4 rounded shadow overflow-hidden'>
                <p className='text-sm text-neutral-500'>Storage Path:</p>
                <p className='font-semibold'>{storagePath}</p>
            </div>

            <div className="w-full flex flex-col lg:flex-row gap-4 lg:gap-0 justify-between items-center">
                <div className="bg-neutral-100 w-full lg:w-1/3 rounded shadow flex justify-start items-center relative">
                    <span className='mx-2'>
                        <Search className="text-neutral-700" />
                    </span>
                    <input ref={searchRef} onChange={handleSearch} defaultValue={query} className="py-2 focus:outline-none w-full" type="search" placeholder="Search files..." spellCheck="false" autoComplete="false" />

                    {searchRef.current?.value.trim() !== "" && <button onClick={clearQuery} className='absolute top-0 right-0 m-2 cursor-pointer'>
                        <XIcon className="h-6 text-neutral-700 opacity-50 hover:opacity-100 transition-opacity" />
                    </button>}
                </div>

                <div className="flex flex-col lg:flex-row justify-center items-center gap-4 w-full lg:w-fit">
                    <button onClick={upload} className="w-full lg:w-fit cursor-pointer flex jusify-center items-center gap-1.5 bg-emerald-500 hover:bg-emerald-600 text-white py-2 px-4 rounded shadow font-semibold">
                        <Upload className="size-4" />
                        Upload
                    </button>
                </div>
            </div>

            <div className="w-full rounded shadow border border-neutral-200 p-6 overflow-x-auto">
                <table className="w-full overflow-x-hidden">
                    <thead>
                        <tr>
                            <th className="min-w-[200px] lg:min-w-[400px] font-normal text-left text-nowrap pl-4 pb-1 font-semibold">Filename</th>
                            <th className="font-normal text-left text-nowrap pl-4 pb-1 font-semibold">Size</th>
                            <th className="font-normal text-left text-nowrap pl-4 pb-1 font-semibold">Last Modified</th>
                            <th className="font-normal text-left text-nowrap pl-4 pb-1 font-semibold">Creation Date</th>
                            <th className="w-[150px] font-normal text-center text-nowrap pb-1 font-semibold">Actions</th>
                        </tr>
                    </thead>
                    <tbody>
                        {files.length > 0 && files.map(file => (
                            <tr key={file.filename} className="border-t border-b border-neutral-200 odd:bg-neutral-100">
                                <td className="px-1">
                                    <input
                                        onChange={e => renameFile(file.filename, e.target.value)}
                                        className='w-full focus:outline-none focus:bg-neutral-200 py-2 rounded px-2'
                                        type="text"
                                        defaultValue={file.filename}
                                        placeholder='Filename'
                                        spellCheck="false"
                                        autoComplete='false'
                                    />
                                </td>
                                <td className="pl-4 py-2">{file.size}</td>
                                <td className="pl-4 py-2">{file.modificationDate}</td>
                                <td className="pl-4 py-2">{file.creationDate}</td>
                                <td className="py-2 text-center">
                                    <div className='flex justify-center items-center gap-2 w-full'>
                                        <button onClick={() => downloadFile(file.filename)} className="cursor-pointer rounded-full bg-blue-600 hover:bg-blue-700 text-white p-1.5">
                                            <Download className="size-4" />
                                        </button>

                                        <a href={`${API_URL}/storage/${file.filename}`} target="_blank">
                                            <button className="cursor-pointer rounded-full bg-cyan-500 hover:bg-cyan-600 text-white p-1.5">
                                                <ExternalLink className="size-4" />
                                            </button>
                                        </a>

                                        <button onClick={() => deleteFile(file.filename)} className="cursor-pointer rounded-full bg-red-500 hover:bg-red-600 text-white p-1.5">
                                            <Trash2 className="size-4" />
                                        </button>
                                    </div>
                                </td>
                            </tr>
                        ))}
                    </tbody>
                </table>
            </div>
        </div>
    )
}