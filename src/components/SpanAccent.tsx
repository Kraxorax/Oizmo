import { ReactNode } from "react"

export const SpanAccent = (props: { children: ReactNode }) => {
  return <span className="accent">{props.children}</span>
}