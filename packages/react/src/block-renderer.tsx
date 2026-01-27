/**
 * @create-markdown/react - Block Renderer
 * Render blocks as React elements
 */

import React from 'react';
import type {
    Block,
    TextSpan,
    HeadingBlock,
    CodeBlockBlock,
    ImageBlock,
    TableBlock,
    CalloutBlock,
    CheckListBlock,
} from '@create-markdown/core';

// ============================================================================
// Types
// ============================================================================

export interface BlockRendererProps {
    /** Blocks to render */
    blocks: Block[];
    /** Custom class name for the container */
    className?: string;
    /** Custom renderers for specific block types */
    customRenderers?: Partial<BlockRenderers>;
}

export interface BlockRenderers {
    paragraph: React.ComponentType<{ block: Block }>;
    heading: React.ComponentType<{ block: HeadingBlock }>;
    bulletList: React.ComponentType<{ block: Block }>;
    numberedList: React.ComponentType<{ block: Block }>;
    checkList: React.ComponentType<{ block: CheckListBlock }>;
    codeBlock: React.ComponentType<{ block: CodeBlockBlock }>;
    blockquote: React.ComponentType<{ block: Block }>;
    table: React.ComponentType<{ block: TableBlock }>;
    image: React.ComponentType<{ block: ImageBlock }>;
    divider: React.ComponentType<{ block: Block }>;
    callout: React.ComponentType<{ block: CalloutBlock }>;
}

export interface SingleBlockProps {
    block: Block;
    customRenderers?: Partial<BlockRenderers>;
}

// ============================================================================
// Main Component
// ============================================================================

/**
 * Renders: array of blocks as React elements
 */
export function BlockRenderer({
    blocks,
    className,
    customRenderers,
}: BlockRendererProps): React.ReactElement {
    return (
        <div className={className}>
            {blocks.map((block) => (
                <BlockElement
                    key={block.id}
                    block={block}
                    customRenderers={customRenderers}
                />
            ))}
        </div>
    );
}

/**
 * Renders: single block
 */
export function BlockElement({
    block,
    customRenderers,
}: SingleBlockProps): React.ReactElement | null {
    // Check for custom renderer first
    const CustomRenderer = customRenderers?.[block.type as keyof BlockRenderers];
    if (CustomRenderer) {
        return <CustomRenderer block={block as never} />;
    }

    // Use default renderers
    switch (block.type) {
        case 'paragraph':
            return <ParagraphRenderer block={block} />;

        case 'heading':
            return <HeadingRenderer block={block as HeadingBlock} />;

        case 'bulletList':
            return <BulletListRenderer block={block} customRenderers={customRenderers} />;

        case 'numberedList':
            return <NumberedListRenderer block={block} customRenderers={customRenderers} />;

        case 'checkList':
            return <CheckListRenderer block={block as CheckListBlock} />;

        case 'codeBlock':
            return <CodeBlockRenderer block={block as CodeBlockBlock} />;

        case 'blockquote':
            return <BlockquoteRenderer block={block} />;

        case 'table':
            return <TableRenderer block={block as TableBlock} />;

        case 'image':
            return <ImageRenderer block={block as ImageBlock} />;

        case 'divider':
            return <DividerRenderer />;

        case 'callout':
            return <CalloutRenderer block={block as CalloutBlock} />;

        default:
            return null;
    }
}

// ============================================================================
// Inline Content Renderer
// ============================================================================

interface InlineContentProps {
    spans: TextSpan[];
}

/**
 * Renders: inline content (text spans with styles)
 */
export function InlineContent({ spans }: InlineContentProps): React.ReactElement {
    return (
        <>
            {spans.map((span, index) => (
                <SpanElement key={index} span={span} />
            ))}
        </>
    );
}

interface SpanProps {
    span: TextSpan;
}

/**
 * Renders: single text span with styles
 */
function SpanElement({ span }: SpanProps): React.ReactElement {
    let content: React.ReactNode = span.text;
    const styles = span.styles;

    // Apply styles from innermost to outermost
    if (styles.code) {
        content = <code>{content}</code>;
    }

    if (styles.highlight) {
        content = <mark>{content}</mark>;
    }

    if (styles.strikethrough) {
        content = <del>{content}</del>;
    }

    if (styles.underline) {
        content = <u>{content}</u>;
    }

    if (styles.italic) {
        content = <em>{content}</em>;
    }

    if (styles.bold) {
        content = <strong>{content}</strong>;
    }

    if (styles.link) {
        content = (
            <a href={styles.link.url} title={styles.link.title}>
                {content}
            </a>
        );
    }

    return <>{content}</>;
}

// ============================================================================
// Block Renderers
// ============================================================================

/**
 * Renders: paragraph block
 */
function ParagraphRenderer({ block }: { block: Block }): React.ReactElement {
    return (
        <p>
            <InlineContent spans={block.content} />
        </p>
    );
}

/**
 * Renders: heading block
 */
function HeadingRenderer({ block }: { block: HeadingBlock }): React.ReactElement {
    const Tag = `h${block.props.level}` as keyof React.JSX.IntrinsicElements;

    return (
        <Tag>
            <InlineContent spans={block.content} />
        </Tag>
    );
}

/**
 * Renders: bullet list block
 */
function BulletListRenderer({
    block,
    customRenderers,
}: {
    block: Block;
    customRenderers?: Partial<BlockRenderers>;
}): React.ReactElement {
    return (
        <ul>
            {block.children.map((child) => (
                <li key={child.id}>
                    <InlineContent spans={child.content} />
                    {child.children.length > 0 && (
                        <BlockElement block={child} customRenderers={customRenderers} />
                    )}
                </li>
            ))}
        </ul>
    );
}

/**
 * Renders: numbered list block
 */
function NumberedListRenderer({
    block,
    customRenderers,
}: {
    block: Block;
    customRenderers?: Partial<BlockRenderers>;
}): React.ReactElement {
    return (
        <ol>
            {block.children.map((child) => (
                <li key={child.id}>
                    <InlineContent spans={child.content} />
                    {child.children.length > 0 && (
                        <BlockElement block={child} customRenderers={customRenderers} />
                    )}
                </li>
            ))}
        </ol>
    );
}

/**
 * Renders: checklist block
 */
function CheckListRenderer({ block }: { block: CheckListBlock }): React.ReactElement {
    return (
        <div style={{ display: 'flex', alignItems: 'flex-start', gap: '0.5rem' }}>
            <input
                type="checkbox"
                checked={block.props.checked}
                readOnly
                style={{ marginTop: '0.25rem' }}
            />
            <span style={{ textDecoration: block.props.checked ? 'line-through' : 'none' }}>
                <InlineContent spans={block.content} />
            </span>
        </div>
    );
}

/**
 * Renders: code block block
 */
function CodeBlockRenderer({ block }: { block: CodeBlockBlock }): React.ReactElement {
    const code = block.content.map((span) => span.text).join('');
    const language = block.props.language;

    return (
        <pre>
            <code className={language ? `language-${language}` : undefined}>
                {code}
            </code>
        </pre>
    );
}

/**
 * Renders: blockquote block
 */
function BlockquoteRenderer({ block }: { block: Block }): React.ReactElement {
    return (
        <blockquote>
            <InlineContent spans={block.content} />
        </blockquote>
    );
}

/**
 * Renders: table block
 */
function TableRenderer({ block }: { block: TableBlock }): React.ReactElement {
    const { headers, rows, alignments } = block.props;

    const getAlignment = (index: number): React.CSSProperties['textAlign'] => {
        return alignments?.[index] ?? undefined;
    };

    return (
        <table>
            {headers.length > 0 && (
                <thead>
                    <tr>
                        {headers.map((header, i) => (
                            <th key={i} style={{ textAlign: getAlignment(i) }}>
                                {header}
                            </th>
                        ))}
                    </tr>
                </thead>
            )}
            <tbody>
                {rows.map((row, rowIndex) => (
                    <tr key={rowIndex}>
                        {row.map((cell, cellIndex) => (
                            <td key={cellIndex} style={{ textAlign: getAlignment(cellIndex) }}>
                                {cell}
                            </td>
                        ))}
                    </tr>
                ))}
            </tbody>
        </table>
    );
}

/**
 * Renders: image block
 */
function ImageRenderer({ block }: { block: ImageBlock }): React.ReactElement {
    return (
        <figure>
            <img
                src={block.props.url}
                alt={block.props.alt ?? ''}
                title={block.props.title}
                width={block.props.width}
                height={block.props.height}
            />
            {block.props.alt && <figcaption>{block.props.alt}</figcaption>}
        </figure>
    );
}

/**
 * Renders: divider block
 */
function DividerRenderer(): React.ReactElement {
    return <hr />;
}

/**
 * Renders: callout block
 */
function CalloutRenderer({ block }: { block: CalloutBlock }): React.ReactElement {
    const calloutType = block.props.type;

    const styles: React.CSSProperties = {
        padding: '1rem',
        borderRadius: '0.25rem',
        borderLeft: '4px solid',
        marginBottom: '1rem',
    };

    // Color based on callout type
    const colors: Record<string, { borderColor: string; backgroundColor: string }> = {
        info: { borderColor: '#3b82f6', backgroundColor: '#eff6ff' },
        warning: { borderColor: '#f59e0b', backgroundColor: '#fffbeb' },
        tip: { borderColor: '#10b981', backgroundColor: '#ecfdf5' },
        danger: { borderColor: '#ef4444', backgroundColor: '#fef2f2' },
        note: { borderColor: '#6b7280', backgroundColor: '#f9fafb' },
    };

    const colorStyle = colors[calloutType] ?? colors.note;

    return (
        <div
            style={{
                ...styles,
                borderLeftColor: colorStyle.borderColor,
                backgroundColor: colorStyle.backgroundColor,
            }}
            role="alert"
        >
            <strong style={{ textTransform: 'capitalize', display: 'block', marginBottom: '0.5rem' }}>
                {calloutType}
            </strong>
            <InlineContent spans={block.content} />
        </div>
    );
}

// ============================================================================
// Exports
// ============================================================================

export default BlockRenderer;
