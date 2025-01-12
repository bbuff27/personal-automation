export const checkboxTrueFilter = {
  or: [
    {
      property: "SUN",
      checkbox: {
        equals: true,
      },
    },
    {
      property: "MON",
      checkbox: {
        equals: true,
      },
    },
    {
      property: "TUE",
      checkbox: {
        equals: true,
      },
    },
    {
      property: "WED",
      checkbox: {
        equals: true,
      },
    },
    {
      property: "THU",
      checkbox: {
        equals: true,
      },
    },
    {
      property: "FRI",
      checkbox: {
        equals: true,
      },
    },
    {
      property: "SAT",
      checkbox: {
        equals: true,
      },
    },
  ],
};

export const checkboxFalseFilter = {
  SUN: {
    checkbox: false,
  },
  MON: {
    checkbox: false,
  },
  TUE: {
    checkbox: false,
  },
  WED: {
    checkbox: false,
  },
  THU: {
    checkbox: false,
  },
  FRI: {
    checkbox: false,
  },
  SAT: {
    checkbox: false,
  },
};
