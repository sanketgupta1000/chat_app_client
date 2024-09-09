import { useFieldArray, useForm } from "react-hook-form"

function App() {


    const {register, handleSubmit, control} = useForm({
        defaultValues: {
            interests: [
                {
                    myid: "i1",
                    name: "Reading"
                },
                {
                    myid: "i2",
                    name: "Writing"
                },
                {
                    
                    myid: "i3",
                    name: "Music"
                },
            ]
        }
    });

    const {fields} = useFieldArray(
        {
            control,
            name: "interests"
        }
    );

    // console.log(fields);

    const mySubmitHandler = (data)=>
    {
        console.log(data);
    }

    return (
        <>
            <div>
                Hello World
            </div>

            <form onSubmit={handleSubmit(mySubmitHandler)}>

                {
                    fields.map((f, i)=>(
                        <input
                            type="checkbox"
                            key={f.id}
                            {...register(`interests.${i}.value`)}
                        ></input>
                        // add label here
                    ))
                }

                <button>Submit</button>

            </form>

        </>
    )
}

export default App;