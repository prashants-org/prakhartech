// Standard section heading: optional kicker, <h2>, optional intro.
function SectionHead({ kicker, title, lead, align = 'center', id }) {
  return (
    <div className={`sh sh--${align}`}>
      {kicker ? <span className="sh-kicker">{kicker}</span> : null}
      <h2 id={id}>{title}</h2>
      {lead ? <p>{lead}</p> : null}
    </div>
  )
}

export default SectionHead
