import React, { useEffect, useState } from "react";
import API from "../../utils/API";
import { Ticket } from "../../utils/types";


interface SelectedTicketProps {
    ticketId: number | undefined;
}

const SelectedTicket: React.FC<SelectedTicketProps> = ({ ticketId }) => {
    const [selectedTicket, setSelectedTicket] = useState<Ticket | null>(null);

    useEffect(() => {
        async function fetchTicket() {
            if (ticketId !== undefined) {
                const ticket = await API.getTicketById(ticketId);
                setSelectedTicket(ticket);
            }
        }
        console.log(ticketId)
        fetchTicket();
    }, [ticketId]);

    return (
        <div className="shadow-lg rounded-lg p-4 bg-white">
            <div className="border-b pb-2 mb-4">
                <h3 className="text-lg font-semibold">Selected Ticket Info</h3>
            </div>
            {selectedTicket === null ? (
                <div className="m-2">No ticket selected</div>
            ) : (
                <div className="space-y-4">
                    <div className="bg-gray-100 p-4 rounded-lg shadow-inner">
                        <div className="flex flex-col xl:flex-row gap-4">
                            <div className="flex-1">
                                <h6 className="text-sm text-gray-500 uppercase">Ticket Title</h6>
                                <h2 className="text-xl font-bold text-blue-600">{selectedTicket.title}</h2>
                            </div>
                            <div className="flex-1">
                                <h6 className="text-sm text-gray-500 uppercase">Author</h6>
                                <p className="text-blue-600">{selectedTicket.creator}</p>
                            </div>
                        </div>
                        <div className="mt-4">
                            <h6 className="text-sm text-gray-500 uppercase">Description</h6>
                            <p>{selectedTicket.description}</p>
                        </div>
                    </div>

                    <div className="flex flex-wrap gap-4">
                        <div className="flex-1 min-w-[100px]">
                            <h6 className="text-sm text-gray-500 uppercase">Status</h6>
                            <span className="inline-block bg-purple-200 text-purple-800 text-xs px-2 rounded-full uppercase font-semibold tracking-wide mr-2 mb-2">
                                {selectedTicket.status}
                            </span>
                        </div>
                        <div className="flex-1 min-w-[100px]">
                            <h6 className="text-sm text-gray-500 uppercase">Priority</h6>
                            <span className="inline-block bg-purple-200 text-purple-800 text-xs px-2 rounded-full uppercase font-semibold tracking-wide mr-2 mb-2">
                                {selectedTicket.priority}
                            </span>
                        </div>
                        <div className="flex-1 min-w-[100px]">
                            <h6 className="text-sm text-gray-500 uppercase">Type</h6>
                            <span className="inline-block bg-purple-200 text-purple-800 text-xs px-2 rounded-full uppercase font-semibold tracking-wide mr-2 mb-2">
                                {selectedTicket.type}
                            </span>
                        </div>
                    </div>
                    <hr className="my-4" />

                </div>
            )}
        </div>
    );
}

export default SelectedTicket;
