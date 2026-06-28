import { DashboardData } from "@/types/dashboard.type";

export function transformFacebook(response:any):DashboardData{

    return{

        summary:{

            totalPosts:0,

            totalComments:0,

            engagement:0,

            reach:0

        },

        sentiment:{

            positive:0,

            neutral:0,

            negative:0

        },

        timeline:[],

        wordCloud:[],

        topPosts:[],

        platformDistribution:[

            {

                platform:"Facebook",

                total:0

            }

        ]

    };

}