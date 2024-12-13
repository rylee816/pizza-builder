import EditPizza from "@/app/components/EditPizza";
import React from 'react'

const EditPizzaPage = ({ params }) => {
    params = React.use(params)
    console.log(params)
    return <EditPizza params={params} />;
};

export default EditPizzaPage;