'use client';

import { useState, type CSSProperties } from 'react';
import { CERTIFICATE_BOOKS } from './data';
import styles from './completeShelf.module.css';

export default function CredentialShelf({ onOpen3D }: { onOpen3D?: () => void }) {
  const [selected, setSelected] = useState<string | null>(null);
  const book = CERTIFICATE_BOOKS.find(item => item.id === selected);
  return <section className={styles.catalog} aria-label="Certificate archive">
    <header><p>Security · Cloud · Systems</p><h1>Certificate Archive</h1></header>
    {book ? <article className={styles.credential}>
      <button onClick={() => setSelected(null)}>← All certificates</button>
      <p>{book.issuer}</p><h2>{book.title}</h2>
      <p>{book.deck}</p>
      <dl><dt>Status</dt><dd>{book.statusLabel}</dd><dt>Issued</dt><dd>{book.issued}</dd>
        <dt>Validity</dt><dd>{book.validity}</dd>
        {book.credentialId && <><dt>Credential ID</dt><dd>{book.credentialId}</dd></>}
      </dl>
      <p className={styles.catalogNote}>Credential verification link has not been supplied.</p>
      {onOpen3D && <button onClick={onOpen3D}>Explore the 3D archive</button>}
    </article> : <>
      <p>Choose a volume to explore your credentials.</p>
      <div className={styles.mobileBooks}>
        {CERTIFICATE_BOOKS.map(item => <button key={item.id}
          className={styles.mobileBook}
          style={{ '--cover': item.color, '--foil': item.foil } as CSSProperties}
          onClick={() => setSelected(item.id)} aria-label={`View ${item.title}`}>
          <span>{item.issuer}</span><span className={styles.volume}>{item.roman}</span>
          <strong>{item.coverTitle}</strong><span>{item.issued} · {item.statusLabel}</span>
        </button>)}
      </div>
      <p className={styles.catalogNote}>Swipe to browse · Tap a volume for details</p>
      {onOpen3D && <button onClick={onOpen3D}>Explore the 3D archive</button>}
    </>}
  </section>;
}
