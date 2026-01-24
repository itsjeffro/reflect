type LinksProps = {
  notes?: string;
}

export const Links = ({ notes }: LinksProps) => {
  console.log(notes);
  return (
    <>Links</>
  )
}