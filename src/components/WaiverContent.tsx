import React from "react";

const WaiverContent = () => {
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
          INCLUDING THE RIGHT TO SUE OR CLAIM COMPENSATION FOLLOWING AN ACCIDENT.
          PLEASE READ CAREFULLY!
        </p>
      </div>

      <p style={bodyStyle}>
        This Release of Liability, Waiver of Claims, Assumption of Risk and
        Indemnity Agreement ("Agreement") is entered into by the undersigned
        Participant in consideration of being permitted to attend and participate in
        the event known as <strong style={{ color: "#F5EDD6" }}>"A Roaring Twenties Night Under the Stars"</strong> (the
        "Event"), hosted at <strong style={{ color: "#F5EDD6" }}>Still Life Retreat</strong> (the
        "Property").
      </p>

      <p style={headingStyle}>Definition of Releasees</p>
      <p style={bodyStyle}>
        In this Agreement, the term "Releasees" shall include Still Life Retreat,
        its owners, operators, directors, officers, employees, contractors, volunteers,
        agents, affiliates, and representatives. By signing this Agreement, the
        Participant acknowledges and agrees as follows:
      </p>

      <p style={headingStyle}>1. Acknowledgement and Assumption of Risk</p>
      <p style={bodyStyle}>
        The Participant acknowledges that the Property contains natural and man-made
        features, including but not limited to: trails and wooded areas, uneven ground
        and natural terrain, barns and outbuildings, laneways, and recreational areas.
        <br /><br />
        Participation involves inherent and obvious and non-obvious risks, including
        but not limited to: slips, trips, and falls; wildlife encounters; weather-related
        hazards; exposure to insects or environmental conditions; proximity to open
        flames or decorative lighting; and injury arising from recreational or evening
        activities.
        <br /><br />
        The Participant freely and voluntarily assumes all risks, both known and unknown,
        foreseeable or unforeseeable, associated with attendance and participation. The
        Participant further acknowledges they are physically and mentally capable of
        participating and accept full responsibility for their own health and safety,
        and represents that they are at least 18 years of age.
      </p>

      <p style={headingStyle}>2. Release of Liability & Waiver of Claims</p>
      <p style={bodyStyle}>
        In consideration of being permitted to enter onto and use the Property, the
        Participant hereby releases, waives, and forever discharges the Releasees from
        any and all liability, claims, demands, actions, damages, losses, costs or
        expenses of any kind whatsoever arising from personal injury, illness, property
        damage, economic loss, or death.
      </p>
      <p style={{ ...bodyStyle, fontWeight: 700 }}>
        THIS WAIVER INCLUDES CLAIMS ARISING FROM THE NEGLIGENCE OF THE RELEASEES,
        BREACH OF CONTRACT, OR BREACH OF ANY STATUTORY OR OTHER DUTY OF CARE,
        INCLUDING ANY DUTY OF CARE OWED UNDER THE OCCUPIERS' LIABILITY ACT, ON
        THE PART OF THE RELEASEES.
      </p>

      <p style={headingStyle}>3. Indemnity</p>
      <p style={bodyStyle}>
        The Participant agrees to indemnify, defend, and hold harmless the Releasees
        from and against any and all claims, actions, liabilities, damages, losses,
        costs, or expenses, including legal fees, arising from: the Participant's
        presence on or use of the Property; any breach of this Agreement or Property
        Rules; any claims brought by third parties arising from the Participant's
        actions or omissions; and any injury or damage caused by the Participant
        while on the Property.
      </p>

      <p style={headingStyle}>4. Medical Responsibility & Authorization</p>
      <p style={bodyStyle}>
        The Participant understands that the Releasees do not provide medical services
        and that emergency response times in rural areas may vary. The Participant
        assumes full responsibility for their own medical needs. In the event of an
        emergency, the Participant authorizes the Releasees to secure medical treatment
        or transportation on their behalf, and assumes all costs associated with such care.
      </p>

      <p style={headingStyle}>5. Media Release</p>
      <p style={bodyStyle}>
        The Participant consents to the photography, audio, and video recording of their
        presence and participation at the Event, and grants the Releasees the right to
        use these materials for promotional, marketing, or other operational purposes
        without compensation.
      </p>

      <p style={headingStyle}>6. General Provisions</p>
      <div style={bodyStyle}>
        <p style={{ marginBottom: "8px" }}>
          <strong style={{ color: "#F5EDD6" }}>No Assignment:</strong> Attendance rights may not be transferred or assigned without prior written approval.
        </p>
        <p style={{ marginBottom: "8px" }}>
          <strong style={{ color: "#F5EDD6" }}>Governing Law:</strong> This Agreement shall be governed by and interpreted in accordance with the laws of the Province of Ontario.
        </p>
        <p style={{ marginBottom: "8px" }}>
          <strong style={{ color: "#F5EDD6" }}>Severability:</strong> If any provision is found to be invalid or unenforceable, the remaining provisions shall remain in full force and effect.
        </p>
      </div>

      <p style={headingStyle}>7. Data Privacy & Consent</p>
      <p style={bodyStyle}>
        By signing below or clicking "I Agree," I consent to the collection, use,
        and secure storage of my personal information strictly for the purposes of
        executing this legal agreement. I agree that an electronic signature or
        clickwrap execution of this document is legally binding and equivalent to
        my handwritten signature.
      </p>

      <div style={{ borderTop: "1px solid rgba(201,151,58,0.2)", margin: "28px 0" }} />

      <p style={headingStyle}>Schedule A: Property Rules</p>
      <p style={bodyStyle}>
        All Participants agree to comply with the following Property rules. Any damages
        caused by the Participant may result in financial liability.
      </p>
      <div style={bodyStyle}>
        <p style={{ marginBottom: "8px" }}>
          <strong style={{ color: "#F5EDD6" }}>Parking:</strong> Vehicles must be parked only in designated areas.
        </p>
        <p style={{ marginBottom: "8px" }}>
          <strong style={{ color: "#F5EDD6" }}>Fire Safety & Smoking:</strong> Open fires are prohibited. Smoking is permitted only in designated outdoor areas.
        </p>
        <p style={{ marginBottom: "8px" }}>
          <strong style={{ color: "#F5EDD6" }}>Decorations:</strong> Glitter, confetti, and sparklers are prohibited.
        </p>
        <p style={{ marginBottom: "8px" }}>
          <strong style={{ color: "#F5EDD6" }}>Property Condition:</strong> Participants must respect the Property and leave all areas in the same condition as found.
        </p>
      </div>
    </div>
  );
};

export default WaiverContent;
