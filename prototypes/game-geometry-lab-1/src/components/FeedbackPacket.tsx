import type { FeedbackPacket as FeedbackPacketType } from "../experience/model";

export function FeedbackPacket({ packet }: { packet: FeedbackPacketType }) {
  return (
    <section
      className={`feedback-sheet feedback-sheet--${packet.kind}`}
      aria-labelledby="feedback-heading"
    >
      <h3 id="feedback-heading">
        <span aria-hidden="true">{packet.kind === "calm-error" ? "!" : "i"}</span>
        What Python noticed
      </h3>
      <dl>
        <div><dt>Goal</dt><dd>{packet.goal}</dd></div>
        <div><dt>Observed</dt><dd>{packet.observed}</dd></div>
        <div><dt>Clue</dt><dd>{packet.clue}</dd></div>
        <div><dt>Next action</dt><dd>{packet.nextAction}</dd></div>
      </dl>
    </section>
  );
}
