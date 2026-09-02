import type { FeedbackPacket as FeedbackPacketType } from "../experience/model";

export function FeedbackPacket({ packet }: { packet: FeedbackPacketType }) {
  return (
    <section
      className={`feedback-packet feedback-packet--${packet.kind}`}
      aria-labelledby="feedback-title"
    >
      <div className="feedback-packet__heading">
        <span aria-hidden="true">{packet.kind === "calm-error" ? "◇" : "○"}</span>
        <h3 id="feedback-title">Investigation feedback</h3>
      </div>
      <dl>
        <div>
          <dt>Goal</dt>
          <dd>{packet.goal}</dd>
        </div>
        <div>
          <dt>Observed</dt>
          <dd>{packet.observed}</dd>
        </div>
        <div>
          <dt>Clue</dt>
          <dd>{packet.clue}</dd>
        </div>
        <div>
          <dt>Next Action</dt>
          <dd>{packet.nextAction}</dd>
        </div>
      </dl>
    </section>
  );
}
