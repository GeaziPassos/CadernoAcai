<?php
class Dupla {
    private int $id;
    private int $colaborador1Id;
    private int $colaborador2Id;

    public function __construct(int $id, int $colaborador1Id, int $colaborador2Id) {
        $this->id = $id;
        $this->colaborador1Id = $colaborador1Id;
        $this->colaborador2Id = $colaborador2Id;
    }

    // Getters
    public function getId() {
        return $this->id;
    }

    public function getColaborador1Id() {
        return $this->colaborador1Id;
    }

    public function getColaborador2Id() {
        return $this->colaborador2Id;
    }

    // Setters
     public function setId(int $id) {
        $this->id = $id;
    }

    public function setColaborador1Id(int $colaborador1Id) {
        $this->colaborador1Id = $colaborador1Id;
    }

    public function setColaborador2Id(int $colaborador2Id) {
        $this->colaborador2Id = $colaborador2Id;
    }
    
}