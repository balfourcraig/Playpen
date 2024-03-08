const house = {
    name: "House",
    color: "red",
    offset: { x: 0, y: 0 },
    points: [
        { x: 0, y: 0 },
    ],
    doors: [
        {
            name: "Front Door",
            color: "silver",
            position: { x: 7.63, y: 11.2 },
            width: 0.77,
            angle: 180,
            openInwards: true,
        },
    ],
    subParts: [
        {
            name: "Master Bedroom",
            color: "black",
            offset: { x: 2.5, y: 0 },
            points: [
                { x: 0, y: 0 },
                { x: 3.2, y: 0 },
                { x: 3.81, y: 0 },
                { x: 3.81, y: 1.72 },
                { x: 3.2, y: 1.72 },
                { x: 3.2, y: 3.2 },
                { x: 0, y: 3.2 },
            ],
            doors: [
                {
                    name: "Door",
                    color: "silver",
                    position: { x: 3.11, y: 3.26 },
                    width: 0.77,
                    angle: 180,
                    openInwards: true,
                },
            ],
        },
        {
            name: "Study",
            color: "black",
            offset: { x: 5.84, y: 0 },
            points: [
                { x: 0.61, y: 0 },
                { x: 3.71, y: 0 },
                { x: 3.71, y: 3.19 },
                { x: 0, y: 3.19 },
                { x: 0, y: 1.83 },
                { x: 0.61, y: 1.83 },
            ],
            doors: [
                {
                    name: "Door",
                    color: "silver",
                    position: { x: 0.05, y: 3.26 },
                    width: 0.77,
                    angle: 0,
                    openInwards: false,
                },
            ],
        },
        {
            name: "Spare Room",
            color: "black",
            offset: { x: 6.74, y: 3.33 },
            points: [
                { x: 0, y: 0 },
                { x: 2.81, y: 0 },
                { x: 2.81, y: 3.8 },
                { x: 0, y: 3.8 },
            ],
            doors: [
                {
                    name: "Door",
                    color: "silver",
                    position: { x: -0.05, y: 0.69 },
                    width: 0.77,
                    angle: 90,
                    openInwards: false,
                },
            ],
        },
        {
            name: "Hall",
            color: "black",
            offset: { x: 2.62, y: 3.34 },
            points: [
                { x: -0.05, y: 0 },
                { x: 4.01, y: 0 },
                { x: 4.01, y: 5.73 },
                { x: 2.95, y: 5.73 },
                { x: 2.95, y: 1.05 },
                { x: 1.53, y: 1.05 },
                { x: 1.53, y: 1.71 },
                { x: -0.05, y: 1.71 },
            ],
            doors: [
                {
                    name: "Door",
                    color: "blue",
                    position: { x: 2.95, y: 5.5 },
                    width: 0.77,
                    angle: 270,
                    openInwards: true,
                },
                {
                    name: "Door",
                    color: "silver",
                    position: { x: 3.86, y: 5.8 },
                    width: 0.77,
                    angle: 180,
                    openInwards: true,
                },
            ],
        },
        {
            name: "Hot Water Cupboard",
            color: "orangered",
            offset: { x: 4.6, y: 7.78 },
            points: [
                { x: 0, y: 0 },
                { x: 0.8, y: 0 },
                { x: 0.8, y: 1.3 },
                { x: 0, y: 1.3 },
            ]
        },
        {
            name: "Living Room",
            color: "black",
            offset: { x: 0, y: 5.19 },
            points: [
                { x: 0, y: 0 },
                { x: 4.27, y: 0 },
                { x: 4.27, y: -0.66 },
                { x: 5.42, y: -0.66 },
                { x: 5.42, y: 2.46 },
                { x: 4.48, y: 2.46 },
                { x: 4.48, y: 3.91 },
                { x: 0, y: 3.91 },
            ]
        },
        {
            name: "Conservatory",
            color: "green",
            offset: { x: -0.10, y: -0.1 },
            points: [
                { x: 0, y: 0 },
                { x: 2.47, y: 0 },
                { x: 2.47, y: 5.15 },
                { x: 0, y: 5.15 },
            ],
            doors: [
                {
                    name: "Door",
                    color: "silver",
                    position: { x: 1.4, y: -0.07 },
                    width: 1,
                    angle: 0,
                    sliding: true,
                },
            ],
        },
        {
            name: "Dining Room",
            color: "black",
            offset: { x: 0, y: 9.24 },
            points: [
                { x: 0, y: 0 },
                { x: 3.14, y: 0 },
                { x: 3.14, y: 1.23 },
                { x: 2.69, y: 1.23 },
                { x: 2.69, y: 3 },
                { x: 0, y: 3 },
            ],
            doors: [
                {
                    name: "Door",
                    color: "silver",
                    position: { x: 1.4, y: -0.07 },
                    width: 1.1,
                    angle: 180,
                    sliding: true,
                },
            ],
        },
        {
            name: "Bathroom",
            color: "blue",
            offset: { x: 6.77, y: 7.9 },
            points: [
                { x: 0, y: 0 },
                { x: 2.8, y: 0 },
                { x: 2.8, y: 1.17 },
                { x: 0, y: 1.17 },
            ]
        },
        {
            name: "Shower",
            color: "dodgerblue",
            offset: { x: 6.77, y: 7.25 },
            points: [
                { x: 0, y: 0 },
                { x: 0.8, y: 0 },
                { x: 0.8, y: 0.65 },
                { x: 0, y: 0.65 },
            ]
        },
        {
            name: "Bath",
            color: "dodgerblue",
            offset: { x: 7.57, y: 7.25 },
            points: [
                { x: 0, y: 0 },
                { x: 2, y: 0 },
                { x: 2, y: 0.65 },
                { x: 0, y: 0.65 },
            ]
        },
        {
            name: "Toilet",
            color: "blue",
            offset: { x: 7.9, y: 9.21 },
            points: [
                { x: 0, y: 0 },
                { x: 1.68, y: 0 },
                { x: 1.68, y: 0.81},
                { x: 0, y: 0.81},
            ]
        },
        {
            name: "Laundry",
            color: "blue",
            offset: { x: 7.9, y: 10.16 },
            points: [
                { x: 0, y: 0 },
                { x: 1.68, y: 0 },
                { x: 1.68, y: 2.11},
                { x: 0, y: 2.11},
            ]
        },
        {
            name: "Kitchen",
            color: "gold",
            offset: { x: 3.15, y: 9.23 },
            points: [
                { x: 0, y: 0 },
                { x: 4.6, y: 0 },
                { x: 4.6, y: 1.9 },
                { x: 3.48, y: 1.9 },
                { x: 3.48, y: 3},
                { x: 0, y: 3},
            ]
        }
    ]
}