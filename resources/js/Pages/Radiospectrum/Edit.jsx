// resources/js/Pages/Documents/Edit.jsx

import React, { useEffect, useState } from "react";

import AuthenticatedLayout from "@/Layouts/AuthenticatedLayout";

import SidebarUpdate from "./SidebarUpdate";
import Header from "./Header";
import SpectrumGroup from "./SpectrumGroup";

import Modal from "@/Components/Modal";

import RangeForm from "./RangeForm";
import UpdateGroup from "./UpdateGroup";
import TextForm from "./TextForm";

import { element } from "./Default";

function Edit({ document }) {

    console.log(document);

    const [page, setPage] = useState({
        title: "",
        format: "A4",
        orientation: "portrait",
        zoom: 1,
        isPrinting: false,
    });

    const [frGroups, setFrGroups] = useState([]);

    const [dirty, setDirty] = useState(false);

    const [addElementModal, setAddElementModal] =
        useState(false);

    const [activeGroup, setActiveGroup] =
        useState(false);

    const [selectedRange, setSelectedRange] =
        useState(false);

    const [textFormActive, setTextFormActive] =
        useState(false);

    // LOAD DOCUMENT
    useEffect(() => {

        if (document) {

            setPage((prev) => ({
                ...prev,
                id:document.id,
                title: document.title || "",

                format:
                    document.format || "A4",

                orientation:
                    document.orientation ||
                    "portrait",

                zoom: document.zoom || 1,
            }));

            const groups = document.groups.map(
                (group) => ({

                    ...group,

                    elements:
                        group.elements || [],
                })
            );

            setFrGroups(groups);
        }

    }, [document]);

    console.log(frGroups,'FRG');

    const sizes = {
        A4: { w: 210, h: 297 },
        A3: { w: 297, h: 420 },
    };

    const current = sizes[page.format];

    const widthMM =
        page.orientation === "portrait"
            ? current.w
            : current.h;

    const heightMM =
        page.orientation === "portrait"
            ? current.h
            : current.w;

    const width = widthMM * 3.78 * page.zoom;

    const height = heightMM * 3.78 * page.zoom;

    const updateField = (key, value) => {
        setDirty(true);
        setFrGroups((prev) =>
            prev.map((group) => ({

                ...group,

                elements: group.elements.map(
                    (item) =>

                        item.id === selectedRange.id
                            ? {
                                  ...item,
                                  [key]: value,
                              }
                            : item
                ),
            }))
        );
    };

    const copyElement = (item) => {

        const newElement = {
            ...item,

            id:
                Date.now().toString() +
                Math.random().toString(36),

            x: item.x + 10,
            y: item.y + 10,
        };

        setFrGroups((prev) =>
            prev.map((group) =>

                group.id === item.group_id
                    ? {
                          ...group,

                          elements: [
                              ...group.elements,
                              newElement,
                          ],
                      }
                    : group
            )
        );
    };

    const deleteElement = (item) => {

        setFrGroups((prev) =>
            prev.map((group) =>

                group.id === item.group_id
                    ? {
                          ...group,

                          elements:
                              group.elements.filter(
                                  (e) =>
                                      e.id !== item.id
                              ),
                      }
                    : group
            )
        );
    };

    const addElement = (groupId) => {
        setDirty(true);
        const newElement = {
            ...element,

            id:
                Date.now().toString() +
                Math.random().toString(36),

            group_id: groupId,
        };

        setFrGroups((prev) =>
            prev.map((group) =>

                group.id === groupId
                    ? {
                          ...group,

                          elements: [
                              ...group.elements,
                              newElement,
                          ],
                      }
                    : group
            )
        );
    };

    return (
        <AuthenticatedLayout
            sidebar={
                <SidebarUpdate
                    page={page}
                    setPage={setPage}
                    setAddElementModal={
                        setAddElementModal
                    }
                    selectedRange={
                        selectedRange
                    }
                    updateField={updateField}
                    copyElement={copyElement}
                    deleteElement={
                        deleteElement
                    }
                    frGroups={frGroups}
                    setDirty={setDirty}
                    dirty={dirty}
                />
            }
            header={<Header />}
        >

            <Modal
                show={addElementModal}
                onClose={() =>
                    setAddElementModal(false)
                }
                maxWidth="7xl"
                closeable={false}
            >
                <RangeForm
                    setFrGroups={setFrGroups}
                    frGroups={frGroups}
                    pageWidth={width}
                    closeCallback={() =>
                        setAddElementModal(false)
                    }

                />
            </Modal>

            <Modal
                show={activeGroup}
                onClose={() =>
                    setActiveGroup(false)
                }
            >
                <UpdateGroup
                    activeGroup={activeGroup}
                    setFrGroups={setFrGroups}
                    frGroups={frGroups}
                    pageWidth={width}
                />
            </Modal>

            <Modal
                show={textFormActive}
                onClose={() =>
                    setTextFormActive(false)
                }
            >
                <TextForm
                    group_id={textFormActive}
                    setFrGroups={setFrGroups}
                    frGroups={frGroups}
                />
            </Modal>

            <div className="flex items-center justify-center min-h-full p-10">

                <div
                    id="editor"
                    className="bg-white shadow-2xl rounded-sm"
                    style={{
                        width: `${width}px`,
                        height: `${height}px`,
                        transformOrigin: "center",
                        
                        ...(page.isPrinting ? {} : {
                            backgroundImage: `
                                linear-gradient(to right, rgba(0,0,0,0.08) 1px, transparent 1px),
                                linear-gradient(to bottom, rgba(0,0,0,0.08) 1px, transparent 1px)
                            `,
                            backgroundSize: "25px 25px",
                        })
                        
                    }}
                >

                    <div className="text-black"
                
                    >

                        <SpectrumGroup
                            frGroups={frGroups}
                            setFrGroups={setFrGroups}
                            activeGroup={activeGroup}
                            setActiveGroup={
                                setActiveGroup
                            }
                            selectedRange={
                                selectedRange
                            }
                            setSelectedRange={
                                setSelectedRange
                            }
                            page={page}
                            setTextFormActive={
                                setTextFormActive
                            }
                            addElement={addElement}
                            setDirty={setDirty}
                        />

                    </div>

                </div>

            </div>

        </AuthenticatedLayout>
    );
}

export default Edit;