import React from 'react';
import { Copy, Check, XCircle, Sparkles  } from 'lucide-react';
import toast from 'react-hot-toast';

interface CodeBlockProps {
  code: string;
  refactoredCode?: string;
  language?: string;
  interactive?: boolean;
  deleteCodeBlock?: () => void;
  updateCodeContent?: () => void;
  className? : string;
  id?: string;
  onContextMenu?: () => void;
  inNotes: boolean;
}

export default function CodeBlock({ code, language = 'bash', interactive=false, inNotes=false, className="", id=-1, refactoredCode="",
                                      deleteCodeBlock=() => console.log("Delete CB Failed! No function."),
                                      updateCodeContent=() => console.log("Update CB Failed! No function."),
                                      onContextMenu=() => console.log("ContextMenu Failed! No function."),
}: CodeBlockProps) {
  const [copied, setCopied] = React.useState(false);

  const [chaningCode, setChangingCode] = React.useState(code);

  const copyToClipboard = async () => {
    try {
      await navigator.clipboard.writeText(code);
      setCopied(true);
      toast.success('Copied to clipboard!');
      setTimeout(() => setCopied(false), 2000);
    } catch (err) {
      toast.error('Failed to copy code');
    }
  };

    const classNames = "relative group " + className
  return (
    <div key={id} className={classNames} onContextMenu={onContextMenu}   >
      <pre className={`language-${language} bg-gray-900 text-gray-100 p-4 rounded-md overflow-x-auto`}>
        <code>
            {(interactive && inNotes) &&
                (<textarea
                    value={refactoredCode}
                    autoComplete="off"
                    autoCorrect="off"
                    autoCapitalize="off"
                    spellCheck={false}
                    className={"bg-gray-900 text-gray-100 w-full"} maxLength={1000}

                    onChange={(e) => {

                        updateCodeContent(id, e.target.value );
                }} placeholder={"Change Code here!"}></textarea>)
            }
            {(interactive && !inNotes) &&
                (<textarea
                    value={chaningCode}
                    autoComplete="off"
                    autoCorrect="off"
                    autoCapitalize="off"
                    spellCheck={false}
                    className={"bg-gray-900 text-gray-100 w-full"} maxLength={1000}

                    ></textarea>)
            }

            {(!interactive) && code}


        </code>
      </pre>

        <div className={""}>
            <button
                onClick={copyToClipboard}
                className="absolute top-2 right-2 p-2 rounded-md bg-gray-800 text-gray-300 opacity-0 group-hover:opacity-100 transition-opacity"
                title="Copy to clipboard"
            >
                {copied ? <Check className="h-4 w-4" /> : <Copy className="h-4 w-4" />}
            </button>

            <button

                className="absolute top-2 right-12 p-2 rounded-md bg-gray-800 text-gray-300 opacity-0 group-hover:opacity-100 transition-opacity"
                title="Explain this to me"
            >
                <Sparkles  className="h-4 w-4" />
            </button>

        </div>


    </div>
  );
}