package com.piec1.api_iot.service;

import com.piec1.api_iot.dto.ProdutoRequestDTO;
import com.piec1.api_iot.dto.ProdutoResponseDTO;
import com.piec1.api_iot.models.Produto;
import com.piec1.api_iot.repositories.ProdutoRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import java.util.List;
import java.util.stream.Collectors;

@Service
public class ProdutoService {

    @Autowired
    private ProdutoRepository produtoRepository;

    public ProdutoResponseDTO cadastrarProduto(ProdutoRequestDTO dto) {
        Produto produto = new Produto();
        produto.setNome(dto.nome());

        Produto produtoSalvo = produtoRepository.save(produto);

        return new ProdutoResponseDTO(produtoSalvo.getId(), produtoSalvo.getNome());
    }

    public List<ProdutoResponseDTO> listarTodos() {
        return produtoRepository.findAll().stream().
                map(p -> new ProdutoResponseDTO(p.getId(), p.getNome())).
                collect(Collectors.toList());
    }
}
