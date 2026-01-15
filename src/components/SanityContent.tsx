import ReactMarkdown from 'react-markdown';
import rehypeRaw from 'rehype-raw';
import { PortableText } from '@portabletext/react';

interface SanityContentProps {
    content: any;
    className?: string;
}

const portableTextComponents = {
    block: {
        normal: ({ children }: any) => <p className="mb-6 text-base leading-relaxed text-foreground/80">{children}</p>,
        h1: ({ children }: any) => <h1 className="mt-12 mb-6 first:mt-0">{children}</h1>,
        h2: ({ children }: any) => <h2 className="mt-12 mb-6 first:mt-0">{children}</h2>,
        h3: ({ children }: any) => <h3 className="mt-10 mb-4 first:mt-0">{children}</h3>,
        blockquote: ({ children }: any) => (
            <blockquote className="border-l-4 border-primary pl-6 py-4 my-8 italic text-foreground/70 bg-white/50 rounded-r-lg">
                {children}
            </blockquote>
        ),
    },
    list: {
        bullet: ({ children }: any) => <ul className="list-disc pl-6 mb-6 space-y-2">{children}</ul>,
        number: ({ children }: any) => <ol className="list-decimal pl-6 mb-6 space-y-2">{children}</ol>,
    },
    listItem: {
        bullet: ({ children }: any) => <li className="text-base text-foreground/80 leading-relaxed">{children}</li>,
        number: ({ children }: any) => <li className="text-base text-foreground/80 leading-relaxed">{children}</li>,
    },
    marks: {
        strong: ({ children }: any) => <strong className="font-semibold text-foreground">{children}</strong>,
        em: ({ children }: any) => <em className="italic">{children}</em>,
        link: ({ children, value }: any) => (
            <a className="text-primary hover:underline font-medium underline-offset-2" target="_blank" rel="noopener noreferrer" href={value.href}>
                {children}
            </a>
        ),
    },
    types: {
        image: ({ value }: any) => (
            <img src={value.asset?.url || value.url} className="rounded-lg shadow-lg my-8 max-w-full mx-auto border border-border" alt="" />
        ),
    }
};

export function SanityContent({ content, className = '' }: SanityContentProps) {
    if (!content) return null;

    const isPortableText = Array.isArray(content);

    return (
        <div className={`prose prose-lg max-w-none ${className}`}>
            {isPortableText ? (
                <PortableText value={content} components={portableTextComponents} />
            ) : (
                <ReactMarkdown
                    rehypePlugins={[rehypeRaw]}
                    components={{
                        iframe: ({ node, ...props }) => {
                            const iframeProps = { ...props } as any;
                            if ('allowfullscreen' in iframeProps || 'allowFullScreen' in iframeProps) {
                                delete iframeProps.allowfullscreen;
                                iframeProps.allowFullScreen = true;
                            }
                            return <iframe {...iframeProps} />;
                        }
                    }}
                >
                    {String(content)}
                </ReactMarkdown>
            )}
        </div>
    );
}
