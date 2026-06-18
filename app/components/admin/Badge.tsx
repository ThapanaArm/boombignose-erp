import { badgeVariant } from "@/lib/format";

export default function Badge({ status }: { status: string }) {
  return <span className={`badge badge-${badgeVariant(status)}`}>{status}</span>;
}
