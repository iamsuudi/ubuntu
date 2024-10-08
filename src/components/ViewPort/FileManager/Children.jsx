import { useContext } from "react";
import { Avatar } from "@radix-ui/themes";
import { PathContext } from "./RootFolder";
import { useState, useEffect } from "react";
import { AppContext } from "../../Window";
import ImageViewer from "../ImageViewer/ImageViewer";
import PDFReader from "../PDFReader/PDFReader";
import AudioPlayer from "../AudioPlayer/AudioPlayer";

function Folder({ dir }) {
	const {
		setPath,
		setHistory,
		history,
		pointer,
		setPointer,
		recent,
		setRecent,
	} = useContext(PathContext);
	const { layer, setLayer, display, setDisplay, setPdf, minimized, setMinimized } =
		useContext(AppContext);

	return (
		<button
			onClick={() => {
				if (dir.type === "file") {
					const previousIndex = recent.indexOf(dir);
					if (previousIndex !== -1) {
						setRecent([
							...recent.slice(0, previousIndex),
							...recent.slice(previousIndex + 1),
							dir,
						]);
					} else {
						setRecent(recent.concat(dir));
						switch (dir.icon) {
							case "image": {
								if (
									!display.find(
										(app) => app.name === "ImageViewer"
									)
								) {
									setDisplay(
										display.concat({
											name: "ImageViewer",
											component: ImageViewer,
										})
									);
									setLayer(layer.concat("ImageViewer"));
								} else {
									const previousIndex =
										layer.indexOf("ImageViewer");
									setLayer([
										...layer.slice(0, previousIndex),
										...layer.slice(previousIndex + 1),
										"ImageViewer",
									]);
									setMinimized(
										minimized.filter(
											(item) => item !== "ImageViewer"
										)
									);
								}
								break;
							}
							case "pdf": {
								if (
									!display.find(
										(app) => app.name === "PDFReader"
									)
								) {
									setDisplay(
										display.concat({
											name: "PDFReader",
											component: PDFReader,
										})
									);
									setLayer(layer.concat("PDFReader"));
									setPdf(dir.name);
								} else {
									const previousIndex =
										layer.indexOf("PDFReader");
									setLayer([
										...layer.slice(0, previousIndex),
										...layer.slice(previousIndex + 1),
										"PDFReader",
									]);
									setPdf(dir.name);
									setMinimized(
										minimized.filter(
											(item) => item !== "PDFReader"
										)
									);
								}
								break;
							}
							case "audio": {
								if (
									!display.find(
										(app) => app.name === "AudioPlayer"
									)
								) {
									setDisplay(
										display.concat({
											name: "AudioPlayer",
											component: AudioPlayer,
										})
									);
									setLayer(layer.concat("AudioPlayer"));
								} else {
									const previousIndex =
										layer.indexOf("AudioPlayer");
									setLayer([
										...layer.slice(0, previousIndex),
										...layer.slice(previousIndex + 1),
										"AudioPlayer",
									]);
									setMinimized(
										minimized.filter(
											(item) => item !== "AudioPlayer"
										)
									);
								}
								break;
							}
							default:
								break;
						}
					}
				} else {
					setPath(dir.path);

					setHistory([...history.slice(0, pointer + 1), dir.path]);

					setPointer(pointer + 1);
				}
			}}
			className="flex items-center gap-3 p-2 rounded-lg hover:bg-white/10">
			<Avatar
				src={`${dir.type === "file" ? dir.icon : "folder"}.png`}
				fallback="Icon"
				size={"4"}
			/>
			<span className="text-sm">{dir.name}</span>
		</button>
	);
}

export default function ChildFolders() {
	const { setPath, path, recent, dirs } = useContext(PathContext);
	const [children, setChildren] = useState([]);

	useEffect(() => {
		function pathResolver(paths, directories) {
			const currentDir = directories.find((d) => d.name === paths[0]);

			if (paths.length === 1) {
				return [...currentDir.children, ...currentDir.files];
			}

			return pathResolver(paths.slice(1), currentDir.children);
		}

		const isRecentDir = path[0] === "Recent";

		const result = isRecentDir
			? recent.reverse()
			: pathResolver(path, dirs);

		setChildren(result);
	}, [path, dirs, recent]);

	return (
		<div
			id="directories"
			className="flex flex-col w-full h-full gap-1 px-4 pb-3 overflow-y-scroll">
			{children.length > 0 &&
				children.map((dir) => {
					return (
						<Folder
							key={dir.path.toString()}
							dir={dir}
							setPath={setPath}
						/>
					);
				})}
			{children.length === 0 && (
				<div className="flex flex-col items-center justify-center w-full h-full">
					<svg
						xmlns="http://www.w3.org/2000/svg"
						fill="none"
						viewBox="0 0 24 24"
						strokeWidth={0.5}
						stroke="gray"
						className="size-40">
						<path
							strokeLinecap="round"
							strokeLinejoin="round"
							d="M2.25 12.75V12A2.25 2.25 0 0 1 4.5 9.75h15A2.25 2.25 0 0 1 21.75 12v.75m-8.69-6.44-2.12-2.12a1.5 1.5 0 0 0-1.061-.44H4.5A2.25 2.25 0 0 0 2.25 6v12a2.25 2.25 0 0 0 2.25 2.25h15A2.25 2.25 0 0 0 21.75 18V9a2.25 2.25 0 0 0-2.25-2.25h-5.379a1.5 1.5 0 0 1-1.06-.44Z"
						/>
					</svg>

					{path[0] === "Recent" && (
						<span className="text-xl font-bold">
							No Recent Opened Files
						</span>
					)}
					{path[0] !== "Recent" && (
						<span className="text-xl font-bold">
							Folder is Empty
						</span>
					)}
				</div>
			)}
		</div>
	);
}
