'use client';

import Link from 'next/link';
import { useRef, type ComponentProps } from 'react';

type ShareProjectLinkProps = Omit<
  ComponentProps<typeof Link>,
  'href' | 'scroll' | 'ref' | 'onClick' | 'onNavigate'
>;

/** Remember the actual trigger before the router changes focus during navigation. */
export function ShareProjectLink(props: ShareProjectLinkProps) {
  const link = useRef<HTMLAnchorElement>(null);
  return (
    <Link
      {...props}
      ref={link}
      href="/share"
      scroll={false}
      onNavigate={() => {
        // Next only calls onNavigate for same-tab navigation, not modifier clicks or downloads.
        document.querySelectorAll('[data-project-dialog-opener]').forEach((element) => {
          element.removeAttribute('data-project-dialog-opener');
        });
        link.current?.setAttribute('data-project-dialog-opener', 'true');
      }}
    />
  );
}
