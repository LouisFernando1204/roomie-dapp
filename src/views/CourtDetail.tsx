
const CourtDetail = () => {
    return (
        <div className="w-full h-full flex flex-col justify-center items-center mb-16">
            <div className="w-5/6 h-full flex flex-col justify-center items-center space-y-6">
                <div className="w-full md:flex md:items-center md:justify-between space-y-4 md:space-y-0">
                    <h2 className="shrink-0 text-xl font-semibold text-darkOrange sm:text-2xl">accommodationName</h2>
                    <span className="shrink-0 text-base font-semibold text-primary sm:text-xl">bookingId</span>
                </div>
                <div className="p-6 bg-white antialiased rounded-lg drop-shadow-xl w-full relative">
                    <div className="lg:grid lg:grid-cols-2 lg:gap-8 xl:gap-16">
                        <div className="shrink-0 max-w-md lg:max-w-sm mx-auto">
                            <img className="w-full" src="https://i.pinimg.com/564x/af/b0/b3/afb0b3aa6e4701b1b7b8a3934d8b0a25.jpg" alt="" />
                        </div>
                        <div className="mt-4 lg:mt-0">
                            <div className="flex flex-col justify-center items-start">
                                <span
                                    className="font-semibold text-gray-900 text-lg"
                                >
                                    userAccount
                                </span>
                                <span
                                    className="font-normal text-gray-900 text-base"
                                >
                                    Created at: createdAt
                                </span>
                            </div>
                            <hr className="my-4 border-gray-200" />
                            <p className="text-gray-500 font-normal text-base">
                                userArgument: Lorem ipsum dolor sit amet consectetur adipisicing elit. Beatae iste aperiam dolorum perferendis soluta. Minima deleniti deserunt sequi aliquid numquam sed eligendi, commodi odio et alias quis accusamus nostrum dicta beatae esse ea in nesciunt architecto delectus fuga iure. Dignissimos eveniet, nesciunt architecto praesentium doloremque aliquid sint beatae cum porro quas iusto corporis minus corrupti, culpa optio, dicta id eius quisquam assumenda mollitia ex! Laborum consequuntur numquam perferendis? Omnis molestias sint, eveniet quam voluptatum assumenda quae error culpa? Quasi autem voluptatum assumenda suscipit, explicabo nobis nam quas, doloribus voluptas deleniti tempore, laudantium sed sint. Accusantium, totam? Earum aut blanditiis libero?
                            </p>
                        </div>
                    </div>
                    <span className="bg-darkOrange text-white text-base font-medium px-2.5 py-1 rounded-md absolute bottom-4 right-4">
                        Customer
                    </span>
                </div>
                <div className="p-6 bg-white antialiased rounded-lg drop-shadow-xl w-full relative">
                    <div className="lg:grid lg:grid-cols-2 lg:gap-8 xl:gap-16">
                        <div className="shrink-0 max-w-md lg:max-w-sm mx-auto">
                            <img
                                className="w-full"
                                src="https://i.pinimg.com/564x/af/b0/b3/afb0b3aa6e4701b1b7b8a3934d8b0a25.jpg"
                                alt=""
                            />
                        </div>
                        <div className="mt-4 lg:mt-0">
                            <div className="flex flex-col justify-center items-start">
                                <span className="font-semibold text-gray-900 text-lg">
                                    accommodationId
                                </span>
                                <span className="font-normal text-gray-900 text-base">
                                    Created at: createdAt
                                </span>
                            </div>
                            <hr className="my-4 border-gray-200" />
                            <p className="text-gray-500 font-normal text-base">
                                accommodationArgument: Lorem ipsum dolor sit amet consectetur adipisicing elit. Molestiae deleniti minima alias natus ex voluptatibus. Voluptatum ea autem eum expedita tempora dolore maiores molestiae eligendi ut pariatur. Illum libero pariatur consectetur et distinctio excepturi harum dolores quisquam atque ab aliquam delectus doloremque, saepe, dolorum aspernatur explicabo corporis quasi aut adipisci reprehenderit temporibus. Facilis ipsa voluptates delectus id error neque autem, nesciunt, ut, laboriosam commodi animi. Voluptatum autem, tempore quis voluptas quidem, mollitia dolore ipsum magni maiores repellat laborum alias vitae explicabo aut ea molestiae dolores asperiores rem quasi at dolor fuga facere repudiandae sunt? Alias hic quam a recusandae dolore?
                            </p>
                        </div>
                    </div>
                    <span className="bg-primary text-white text-base font-medium px-2.5 py-1 rounded-md absolute bottom-4 right-4">
                        Accommodation
                    </span>
                </div>
            </div>
        </div>
    )
}

export default CourtDetail