import { useMemo } from 'react'
import PropTypes from 'prop-types'
import ReactQuill from 'react-quill'
import 'react-quill/dist/quill.snow.css'

const DEFAULT_MODULES = {
  toolbar: [
    [{ header: [1, 2, 3, false] }],
    ['bold', 'italic', 'underline', 'strike'],
    [{ list: 'ordered' }, { list: 'bullet' }],
    [{ indent: '-1' }, { indent: '+1' }],
    ['blockquote', 'code-block'],
    ['link', 'image'],
    ['clean'],
  ],
}

/**
 * WordPress-like rich text editor using Quill.
 * value/onChange are HTML strings (same as stored by the backend).
 */
function RichTextEditor({ value = '', onChange, placeholder, minHeight = 180, className }) {
  const modules = useMemo(() => DEFAULT_MODULES, [])

  const handleChange = (content, _delta, _source, editor) => {
    const html = typeof content === 'string' ? content : (editor?.root?.innerHTML ?? '')
    onChange?.(html)
  }

  return (
    <div className={`rich-text-editor-wrap ${className ?? ''}`}>
      <ReactQuill
        theme="snow"
        value={value}
        onChange={handleChange}
        placeholder={placeholder}
        modules={modules}
        style={{ minHeight }}
        className="rich-text-editor"
      />
    </div>
  )
}

RichTextEditor.propTypes = {
  value: PropTypes.string,
  onChange: PropTypes.func,
  placeholder: PropTypes.string,
  minHeight: PropTypes.number,
  className: PropTypes.string,
}

RichTextEditor.defaultProps = {
  value: '',
  onChange: undefined,
  placeholder: undefined,
  minHeight: 180,
  className: undefined,
}

export default RichTextEditor
