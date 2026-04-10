interface WaiverContentProps {
  section1Checked?: boolean;
  onSection1Change?: (checked: boolean) => void;
  section2Checked?: boolean;
  onSection2Change?: (checked: boolean) => void;
  showCheckboxes?: boolean;
}

const WaiverContent = ({
  section1Checked = false,
  onSection1Change,
  section2Checked = false,
  onSection2Change,
  showCheckboxes = false,
}: WaiverContentProps) => {
  const headingStyle: React.CSSProperties = {
    fontFamily: "'Josefin Sans', sans-serif",
    fontSize: "14px",
    letterSpacing: "2px",
    textTransform: "uppercase",
    color: "#C9973A",
    marginBottom: "12px",
    marginTop: "28px",
  };

  const bodyStyle: React.CSSProperties = {
    fontFamily: "'Lora', Georgia, serif",
    fontSize: "14px",
    lineHeight: 1.8,
    color: "#C8B99A",
    marginBottom: "16px",
  };

  const checkboxRow: React.CSSProperties = {
    display: "flex",
    alignItems: "flex-start",
    gap: "12px",
    padding: "14px 16px",
    background: "rgba(201,151,58,0.06)",
    border: "1px solid rgba(201,151,58,0.15)",
    marginBottom: "20px",
    marginTop: "8px",
  };

  return (
    <div>
      {/* WARNING HEADER */}
      <div
        style={{
          background: "rgba(217,119,6,0.12)",
          border: "1px solid rgba(217,119,6,0.3)",
          padding: "16px 20px",
          marginBottom: "24px",
        }}
      >
        <p
          style={{
            fontFamily: "'Josefin Sans', sans-serif",
            fontSize: "12px",
            letterSpacing: "2px",
            textTransform: "uppercase",
            color: "#F59E0B",
            fontWeight: 700,
            lineHeight: 1.6,
          }}
        >
          WARNING: BY SIGNING THIS DOCUMENT YOU WILL WAIVE CERTAIN LEGAL RIGHTS,
          INCLUDING THE RIGHT TO SUE. PLEASE READ CAREFULLY BEFORE SIGNING.
        </p>
      </div>

      <p style={bodyStyle}>
        This Waiver and Release of Liability ("Agreement") is entered into by the
        undersigned participant ("Participant") in connection with the event known
        as <strong style={{ color: "#F5EDD6" }}>"A Roaring Twenties Night Under the Stars"</strong> (the
        "Event"), hosted at <strong style={{ color: "#F5EDD6" }}>Still Life Retreat</strong> (the
        "Venue").
      </p>

      {/* SECTION 1 */}
      <p style={headingStyle}>1. Acknowledgement of Risk</p>
      <p style={bodyStyle}>
        The Participant acknowledges that attendance at the Event involves inherent
        risks, including but not limited to: physical injury from outdoor terrain,
        uneven ground, or natural hazards; exposure to inclement weather;
        interactions with other attendees; consumption of food and beverages;
        proximity to open flames, fire pits, or decorative lighting; and any other
        risks associated with an outdoor evening gathering. The Participant
        voluntarily assumes all such risks, both known and unknown.
      </p>

      {/* SECTION 2 */}
      <p style={headingStyle}>2. Release of Liability</p>
      <p style={bodyStyle}>
        In consideration of being permitted to participate in the Event, the
        Participant hereby releases, waives, and forever discharges the Event
        organizers, Still Life Retreat, its owners, operators, employees, agents,
        volunteers, and affiliates (collectively, the "Released Parties") from any
        and all claims, demands, causes of action, damages, losses, or expenses
        (including legal fees) arising out of or related to the Participant's
        attendance at or participation in the Event, whether caused by negligence
        or otherwise.
      </p>

      {showCheckboxes && (
        <div style={checkboxRow}>
          <input
            type="checkbox"
            checked={section1Checked}
            onChange={(e) => onSection1Change?.(e.target.checked)}
            style={{ marginTop: "4px", accentColor: "#C9973A" }}
          />
          <span style={{ ...bodyStyle, marginBottom: 0, fontSize: "13px" }}>
            I have read and understand Sections 1 and 2 regarding the acknowledgement
            of risk and release of liability.
          </span>
        </div>
      )}

      {/* SECTION 3 */}
      <p style={headingStyle}>3. Medical Responsibility</p>
      <p style={bodyStyle}>
        The Participant acknowledges that the Event organizers are not responsible
        for providing medical care. The Participant agrees to seek their own
        medical attention if needed and assumes full responsibility for any medical
        costs incurred as a result of attending the Event. The Participant
        represents that they are physically and mentally fit to attend and have no
        medical conditions that would prevent safe participation.
      </p>

      {/* SECTION 4 */}
      <p style={headingStyle}>4. Property & Personal Belongings</p>
      <p style={bodyStyle}>
        The Released Parties are not responsible for any loss, theft, or damage to
        the Participant's personal property during the Event. The Participant
        agrees to safeguard their own belongings.
      </p>

      {/* SECTION 5 */}
      <p style={headingStyle}>5. Media & Photography Consent</p>
      <p style={bodyStyle}>
        The Participant grants the Event organizers permission to photograph,
        record, and use their likeness in connection with the Event for
        promotional, marketing, or archival purposes without compensation or
        further consent.
      </p>

      {showCheckboxes && (
        <div style={checkboxRow}>
          <input
            type="checkbox"
            checked={section2Checked}
            onChange={(e) => onSection2Change?.(e.target.checked)}
            style={{ marginTop: "4px", accentColor: "#C9973A" }}
          />
          <span style={{ ...bodyStyle, marginBottom: 0, fontSize: "13px" }}>
            I have read and understand Sections 3, 4, and 5 regarding medical
            responsibility, personal belongings, and media consent.
          </span>
        </div>
      )}

      {/* SECTION 6 */}
      <p style={headingStyle}>6. Indemnification</p>
      <p style={bodyStyle}>
        The Participant agrees to indemnify, defend, and hold harmless the
        Released Parties from any claims, damages, or expenses arising from the
        Participant's own actions, negligence, or breach of this Agreement.
      </p>

      {/* SECTION 7 */}
      <p style={headingStyle}>7. Governing Law</p>
      <p style={bodyStyle}>
        This Agreement shall be governed by and construed in accordance with the
        laws of the Province of Ontario, Canada, without regard to its conflict of
        law provisions.
      </p>

      {/* SECTION 8 */}
      <p style={headingStyle}>8. Severability</p>
      <p style={bodyStyle}>
        If any provision of this Agreement is found to be invalid or
        unenforceable, the remaining provisions shall remain in full force and
        effect.
      </p>
    </div>
  );
};

export default WaiverContent;
