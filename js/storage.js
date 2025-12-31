// DEFAULT TOPICS (small sample — expand as needed)
window.DEFAULT_TOPICS = [
  {
    id: "phy_1",
    subject: "Physics",
    title: "Newton's First Law",
    notes: "An object at rest stays at rest and an object in motion remains in motion unless acted on by a net external force.",
    status: "not-started",
    quiz: {
      type: "mcq",
      question: "Which of the following best states Newton's First Law?",
      choices: [
        "Force equals mass times acceleration",
        "For every action there is an equal and opposite reaction",
        "An object maintains its state of motion unless a net force acts on it",
        "Energy cannot be created or destroyed"
      ],
      answer: 2
    }
  },
  {
    id: "phy_2",
    subject: "Physics",
    title: "Ohm's Law",
    notes: "V = IR. Voltage across a resistor equals current times resistance.",
    status: "not-started",
    quiz: {
      type: "short",
      question: "Write Ohm's law (symbolic form).",
      answer: "v = i r"
    }
  },
  {
    id: "chem_1",
    subject: "Chemistry",
    title: "Ionic Bonding",
    notes: "Ionic bonding is the transfer of electrons from metal to non-metal forming oppositely charged ions.",
    status: "not-started",
    quiz: {
      type: "mcq",
      question: "Which particles are transferred in ionic bonding?",
      choices: ["Protons","Neutrons","Electrons","Photons"],
      answer: 2
    }
  },
  {
    id: "math_1",
    subject: "Math",
    title: "Quadratic Formula",
    notes: "For ax^2 + bx + c = 0, x = [-b ± sqrt(b^2 - 4ac)] / 2a",
    status: "not-started",
    quiz: {
      type: "short",
      question: "State the quadratic formula.",
      answer: "x = (-b ± sqrt(b^2 - 4ac)) / (2a)"
    }
  }
];
