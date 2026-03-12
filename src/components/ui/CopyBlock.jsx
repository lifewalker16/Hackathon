export default function CopyBlock({ title, body }) {
  return (
    <div className="copy-block">
      {title ? <h3 className="copy-block__title">{title}</h3> : null}
      {body ? <p className="copy-block__body">{body}</p> : null}
    </div>
  );
}