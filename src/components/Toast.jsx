export default function Toast({ message, show }) {
  return <div className={'toast' + (show ? ' show' : '')} role="status" aria-live="polite">{message}</div>;
}
